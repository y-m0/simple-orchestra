
import { useCallback } from 'react'
import { useMemory } from './MemoryContext'
import { mockMemoryService } from './mockService'
import type { Memory, MemoryMetadata } from './types'

export const useMemoryHook = () => {
  const memoryContext = useMemory()

  const storeMemory = useCallback(async (
    content: string,
    metadata: Omit<MemoryMetadata, 'timestamp'>,
    options?: { type?: 'short_term' | 'long_term' }
  ) => {
    const { type = 'short_term' } = options || {}
    
    const memory: Omit<Memory, 'id' | 'timestamp'> = {
      type,
      agentId: metadata.agentId,
      content,
      metadata: {
        agentId: metadata.agentId,
        tags: metadata.tags || [],
        type: metadata.type,
        timestamp: Date.now(),
        ...metadata,
      },
    }

    if (type === 'short_term') {
      await memoryContext.storeMemory(memory)
      return 'short-term'
    }

    const id = await mockMemoryService.storeMemory(content, metadata)
    return id
  }, [memoryContext])

  const searchMemory = useCallback(async (
    query: string,
    options?: { 
      limit?: number
      filter?: Partial<MemoryMetadata>
      type?: 'short_term' | 'long_term' | 'all'
    }
  ) => {
    const { limit, filter, type = 'all' } = options || {}
    
    const results = []

    if (type === 'all' || type === 'long_term') {
      const longTermResults = await mockMemoryService.searchMemory(query, { limit, filter })
      results.push(...longTermResults)
    }

    if (type === 'all' || type === 'short_term') {
      const searchFilter: Partial<Memory> = {}
      if (query) {
        searchFilter.content = query
      }
      if (filter) {
        searchFilter.metadata = filter as MemoryMetadata
      }
      const shortTermResults = memoryContext.searchMemory(searchFilter)
      results.push(...shortTermResults)
    }

    return limit ? results.slice(0, limit) : results
  }, [memoryContext])

  const clearMemory = useCallback(async (
    options?: { 
      filter?: Partial<MemoryMetadata>
      type?: 'short_term' | 'long_term' | 'all'
    }
  ) => {
    const { filter, type = 'all' } = options || {}
    
    if (type === 'all' || type === 'short_term') {
      await memoryContext.clearMemory()
    }

    if (type === 'all' || type === 'long_term') {
      await mockMemoryService.clearMemory(filter)
    }
  }, [memoryContext])

  const getMemoryById = useCallback(async (id: string) => {
    const shortTermMemory = memoryContext.getMemoryById(id)
    if (shortTermMemory) return shortTermMemory

    return await mockMemoryService.getMemoryById(id)
  }, [memoryContext])

  return {
    ...memoryContext,
    storeMemory,
    searchMemory,
    clearMemory,
    getMemoryById,
  }
}
