import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { MemoryProvider, useMemory } from '../MemoryContext';
import type { Memory, MemoryMetadata } from '../types';

describe('Memory Module', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryProvider>{children}</MemoryProvider>
  );

  it('should store and retrieve short-term memory', async () => {
    const { result } = renderHook(() => useMemory(), { wrapper });

    const testMemory = {
      type: 'short_term' as const,
      agentId: 'test-agent',
      content: 'test content',
    };

    await act(async () => {
      await result.current.storeMemory(testMemory);
    });

    expect(result.current.memories).toHaveLength(1);
    expect(result.current.memories[0]).toMatchObject(testMemory);
    expect(result.current.memories[0].id).toBeDefined();
    expect(result.current.memories[0].timestamp).toBeDefined();
  });

  it('should store and retrieve long-term memory', async () => {
    const { result } = renderHook(() => useMemory(), { wrapper });

    const completeMetadata: MemoryMetadata = {
      agentId: 'test-agent',
      tags: ['important'],
      type: 'agent',
      timestamp: Date.now()
    };

    const testMemory = {
      type: 'long_term' as const,
      agentId: 'test-agent',
      content: 'test content',
      metadata: completeMetadata
    };

    await act(async () => {
      await result.current.storeMemory(testMemory);
    });

    expect(result.current.memories).toHaveLength(1);
    expect(result.current.memories[0]).toMatchObject(testMemory);
    expect(result.current.memories[0].id).toBeDefined();
    expect(result.current.memories[0].timestamp).toBeDefined();
  });

  it('should search memory with filters', async () => {
    const { result } = renderHook(() => useMemory(), { wrapper });

    const memories: Array<Omit<Memory, 'id' | 'timestamp'>> = [
      {
        type: 'short_term',
        agentId: 'agent1',
        content: 'memory 1',
      },
      {
        type: 'long_term',
        agentId: 'agent2',
        content: 'memory 2',
        metadata: {
          agentId: 'agent2',
          tags: ['important'],
          type: 'agent',
          timestamp: Date.now()
        },
      },
    ];

    await act(async () => {
      for (const memory of memories) {
        await result.current.storeMemory(memory);
      }
    });

    const shortTermResults = result.current.searchMemory({ type: 'short_term' });
    expect(shortTermResults).toHaveLength(1);
    expect(shortTermResults[0]).toMatchObject(memories[0]);

    const agent2Results = result.current.searchMemory({ agentId: 'agent2' });
    expect(agent2Results).toHaveLength(1);
    expect(agent2Results[0]).toMatchObject(memories[1]);
  });

  it('should clear memory', async () => {
    const { result } = renderHook(() => useMemory(), { wrapper });

    const testMemory = {
      type: 'short_term' as const,
      agentId: 'test-agent',
      content: 'test content',
    };

    await act(async () => {
      await result.current.storeMemory(testMemory);
    });

    expect(result.current.memories).toHaveLength(1);

    await act(async () => {
      await result.current.clearMemory();
    });

    expect(result.current.memories).toHaveLength(0);
  });

  it('should get memory by id', async () => {
    const { result } = renderHook(() => useMemory(), { wrapper });

    const testMemory = {
      type: 'short_term' as const,
      agentId: 'test-agent',
      content: 'test content',
    };

    await act(async () => {
      await result.current.storeMemory(testMemory);
    });

    const storedMemory = result.current.memories[0];
    const retrievedMemory = result.current.getMemoryById(storedMemory.id);

    expect(retrievedMemory).toBeDefined();
    expect(retrievedMemory).toEqual(storedMemory);
  });
});
