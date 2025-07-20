
export interface MemoryMetadata {
  agentId: string;
  workflowId?: string;
  timestamp: number;
  tags: string[];
  type: 'agent' | 'workflow' | 'tool' | 'system' | 'user';
  importance?: 'low' | 'medium' | 'high';
  [key: string]: any;
}

export interface MemoryItem {
  id: string;
  text: string;
  embedding?: number[];
  metadata: MemoryMetadata;
}

export interface Memory {
  id: string;
  type: 'short_term' | 'long_term';
  agentId: string;
  content: string;
  timestamp: string;
  metadata?: MemoryMetadata;
}

export interface MemoryContextType {
  memories: Memory[];
  storeMemory: (memory: Omit<Memory, 'id' | 'timestamp'>) => Promise<void>;
  getMemoryById: (id: string) => Memory | undefined;
  searchMemory: (filter: Partial<Memory>) => Memory[];
  clearMemory: () => Promise<void>;
}

export interface MemoryService {
  storeMemory: (text: string, metadata: Omit<MemoryMetadata, 'timestamp'>) => Promise<string>;
  searchMemory: (query: string, options?: { limit?: number; filter?: Partial<MemoryMetadata> }) => Promise<MemoryItem[]>;
  clearMemory: (filter?: Partial<MemoryMetadata>) => Promise<void>;
  getMemoryById: (id: string) => Promise<MemoryItem | null>;
}
