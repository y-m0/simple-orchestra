
import { MemoryService, MemoryItem, MemoryMetadata } from './types';
import { v4 as uuidv4 } from 'uuid';

class MockMemoryService implements MemoryService {
  private memory: MemoryItem[] = [];

  async storeMemory(text: string, metadata: Omit<MemoryMetadata, 'timestamp'>): Promise<string> {
    const id = uuidv4();
    const item: MemoryItem = {
      id,
      text,
      metadata: {
        agentId: metadata.agentId || '',
        tags: metadata.tags || [],
        type: metadata.type || 'workflow',
        timestamp: Date.now(),
        ...metadata,
      },
    };
    this.memory.push(item);
    return id;
  }

  async searchMemory(
    query: string,
    options?: { limit?: number; filter?: Partial<MemoryMetadata> }
  ): Promise<MemoryItem[]> {
    const { limit = 10, filter = {} } = options || {};
    
    let results = this.memory.filter(item => {
      const matchesText = item.text.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = Object.entries(filter).every(([key, value]) => {
        if (key === 'tags') {
          return Array.isArray(value) && value.every(tag => item.metadata.tags.includes(tag));
        }
        return item.metadata[key as keyof MemoryMetadata] === value;
      });
      return matchesText && matchesFilter;
    });

    if (limit) {
      results = results.slice(0, limit);
    }

    return results;
  }

  async clearMemory(filter?: Partial<MemoryMetadata>): Promise<void> {
    if (!filter) {
      this.memory = [];
      return;
    }

    this.memory = this.memory.filter(item => {
      return Object.entries(filter).every(([key, value]) => {
        if (key === 'tags') {
          return Array.isArray(value) && value.every(tag => !item.metadata.tags.includes(tag));
        }
        return item.metadata[key as keyof MemoryMetadata] !== value;
      });
    });
  }

  async getMemoryById(id: string): Promise<MemoryItem | null> {
    return this.memory.find(item => item.id === id) || null;
  }
}

export const mockMemoryService = new MockMemoryService();
