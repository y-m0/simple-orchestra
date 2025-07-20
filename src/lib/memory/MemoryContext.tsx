
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Memory, MemoryContextType } from './types';

// Create Memory Context
const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

interface MemoryProviderProps {
  children: ReactNode;
}

export function MemoryProvider({ children }: MemoryProviderProps) {
  const [memories, setMemories] = useState<Memory[]>([]);

  const storeMemory = useCallback(async (memory: Omit<Memory, 'id' | 'timestamp'>) => {
    const newMemory: Memory = {
      ...memory,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };

    setMemories(prev => [...prev, newMemory]);
  }, []);

  const getMemoryById = useCallback((id: string) => {
    return memories.find(memory => memory.id === id);
  }, [memories]);

  const searchMemory = useCallback((filter: Partial<Memory>) => {
    return memories.filter(memory => {
      return Object.entries(filter).every(([key, value]) => {
        if (key === 'content' && typeof value === 'string') {
          return memory.content.toLowerCase().includes(value.toLowerCase());
        }
        return memory[key as keyof Memory] === value;
      });
    });
  }, [memories]);

  const clearMemory = useCallback(async () => {
    setMemories([]);
  }, []);

  const contextValue: MemoryContextType = {
    memories,
    storeMemory,
    getMemoryById,
    searchMemory,
    clearMemory,
  };

  return (
    <MemoryContext.Provider value={contextValue}>
      {children}
    </MemoryContext.Provider>
  );
}

// Hook for using memory context
export function useMemory() {
  const context = useContext(MemoryContext);
  
  if (context === undefined) {
    throw new Error('useMemory must be used within a MemoryProvider');
  }
  
  return context;
}
