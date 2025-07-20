import { MemoryItem, MemoryMetadata, SearchResult } from '@/types/memory';

// Mock in-memory database for now, could be replaced with actual ChromaDB or other vector store
class MemoryStore {
  private items: MemoryItem[] = [];

  async store(text: string, metadata: Partial<MemoryMetadata>): Promise<MemoryItem> {
    // Ensure required fields are present
    const completeMetadata: MemoryMetadata = {
      agentId: metadata.agentId || 'default',
      workflowId: metadata.workflowId,
      tags: metadata.tags || [],
      type: metadata.type || 'system',
      timestamp: metadata.timestamp || Date.now(),
      ...metadata
    };

    const item: MemoryItem = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      text,
      metadata: completeMetadata,
      createdAt: new Date().toISOString(),
    };

    // In a real implementation, we'd generate vector embeddings here
    // item.vector = await generateEmbeddings(text);
    
    this.items.push(item);
    return item;
  }

  async search(query: string, limit: number = 5): Promise<SearchResult[]> {
    // In a real implementation, we'd perform vector similarity search
    // For now, just do a simple text search
    const results = this.items
      .map(item => ({
        item,
        score: this.calculateRelevanceScore(query, item.text)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return results;
  }

  async clear(filter?: Partial<MemoryMetadata>): Promise<void> {
    if (!filter) {
      this.items = [];
      return;
    }

    this.items = this.items.filter(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (Array.isArray(value) && Array.isArray(item.metadata[key as keyof MemoryMetadata])) {
          // For arrays like tags, check intersection
          const itemValue = item.metadata[key as keyof MemoryMetadata] as any[];
          const filterValue = value as any[];
          if (!filterValue.some(v => itemValue.includes(v))) {
            return true;
          }
        } else if (item.metadata[key as keyof MemoryMetadata] !== value) {
          return true;
        }
      }
      return false;
    });
  }

  private calculateRelevanceScore(query: string, text: string): number {
    // Simple relevance scoring - count overlapping words
    const queryTerms = query.toLowerCase().split(/\s+/);
    const textTerms = text.toLowerCase().split(/\s+/);
    
    const matchCount = queryTerms.reduce((count, term) => {
      return count + (textTerms.includes(term) ? 1 : 0);
    }, 0);
    
    return matchCount / queryTerms.length;
  }
}

// Create singleton instance
const memoryStore = new MemoryStore();

export const memoryService = {
  storeMemory: async (text: string, metadata: Partial<MemoryMetadata>): Promise<MemoryItem> => {
    return await memoryStore.store(text, metadata);
  },
  
  searchMemory: async (query: string, limit: number = 5): Promise<SearchResult[]> => {
    return await memoryStore.search(query, limit);
  },
  
  clearMemory: async (filter?: Partial<MemoryMetadata>): Promise<void> => {
    await memoryStore.clear(filter);
  }
};
