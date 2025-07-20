
export interface MemoryItem {
  id: string;
  text: string;
  content?: string; // Add content property for compatibility
  vector?: number[];
  metadata: MemoryMetadata;
  createdAt: string;
}

export interface MemoryMetadata {
  agentId: string;
  workflowId?: string;
  tags: string[];
  source?: string;
  type: 'workflow' | 'agent' | 'system' | 'user';
  importance?: number;
  timestamp: number;
  [key: string]: any;
}

export interface SearchResult {
  item: MemoryItem;
  score: number;
}

export interface MemoryContextValue {
  shortTermMemory: MemoryItem[];
  storeMemory: (text: string, metadata: Partial<MemoryMetadata>) => Promise<MemoryItem>;
  searchMemory: (query: string, limit?: number) => Promise<SearchResult[]>;
  clearMemory: (filter?: Partial<MemoryMetadata>) => Promise<void>;
  addToContext: (item: MemoryItem) => void;
  removeFromContext: (id: string) => void;
  clearContext: () => void;
}
