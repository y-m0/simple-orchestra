import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'error' | 'offline';
  uptime: number;
  lastActivity: string;
  memoryUsage: number;
  tasksCompleted: number;
}

export interface Swarm {
  id: string;
  name: string;
  description: string;
  topology: 'mesh' | 'hierarchical' | 'ring' | 'star';
  agents: Agent[];
  status: 'active' | 'initializing' | 'paused' | 'error';
  createdAt: string;
  metrics: {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    avgResponseTime: number;
  };
}

interface SwarmContextType {
  swarms: Swarm[];
  selectedSwarm: Swarm | null;
  selectedAgent: Agent | null;
  selectSwarm: (swarmId: string) => void;
  selectAgent: (agentId: string | null) => void;
  updateSwarmMetrics: (swarmId: string, metrics: Partial<Swarm['metrics']>) => void;
}

const SwarmContext = createContext<SwarmContextType | undefined>(undefined);

export function SwarmProvider({ children }: { children: ReactNode }) {
  const [swarms, setSwarms] = useState<Swarm[]>([
    {
      id: 'swarm-1',
      name: 'Research Collective',
      description: 'Specialized agents for research and analysis',
      topology: 'mesh',
      status: 'active',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      agents: [
        {
          id: 'agent-1-1',
          name: 'Literature Analyzer',
          type: 'researcher',
          status: 'active',
          uptime: 98.5,
          lastActivity: '2 min ago',
          memoryUsage: 65,
          tasksCompleted: 47
        },
        {
          id: 'agent-1-2',
          name: 'Data Collector',
          type: 'coder',
          status: 'active',
          uptime: 99.2,
          lastActivity: '1 min ago',
          memoryUsage: 72,
          tasksCompleted: 23
        },
        {
          id: 'agent-1-3',
          name: 'Pattern Detector',
          type: 'analyst',
          status: 'idle',
          uptime: 95.8,
          lastActivity: '5 min ago',
          memoryUsage: 45,
          tasksCompleted: 31
        }
      ],
      metrics: {
        totalTasks: 156,
        completedTasks: 101,
        failedTasks: 8,
        avgResponseTime: 1.2
      }
    },
    {
      id: 'swarm-2',
      name: 'Development Squad',
      description: 'Full-stack development and testing agents',
      topology: 'hierarchical',
      status: 'active',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      agents: [
        {
          id: 'agent-2-1',
          name: 'Backend Architect',
          type: 'architect',
          status: 'active',
          uptime: 97.1,
          lastActivity: '30 sec ago',
          memoryUsage: 88,
          tasksCompleted: 15
        },
        {
          id: 'agent-2-2',
          name: 'Frontend Builder',
          type: 'coder',
          status: 'active',
          uptime: 96.3,
          lastActivity: '1 min ago',
          memoryUsage: 76,
          tasksCompleted: 29
        },
        {
          id: 'agent-2-3',
          name: 'QA Tester',
          type: 'tester',
          status: 'error',
          uptime: 82.4,
          lastActivity: '15 min ago',
          memoryUsage: 34,
          tasksCompleted: 12
        }
      ],
      metrics: {
        totalTasks: 89,
        completedTasks: 56,
        failedTasks: 3,
        avgResponseTime: 2.1
      }
    }
  ]);

  const [selectedSwarm, setSelectedSwarm] = useState<Swarm | null>(swarms[0]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const selectSwarm = useCallback((swarmId: string) => {
    const swarm = swarms.find(s => s.id === swarmId);
    setSelectedSwarm(swarm || null);
    setSelectedAgent(null); // Reset agent selection when switching swarms
  }, [swarms]);

  const selectAgent = useCallback((agentId: string | null) => {
    if (!agentId) {
      setSelectedAgent(null);
      return;
    }
    
    const agent = selectedSwarm?.agents.find(a => a.id === agentId);
    setSelectedAgent(agent || null);
  }, [selectedSwarm]);

  const updateSwarmMetrics = useCallback((swarmId: string, metrics: Partial<Swarm['metrics']>) => {
    setSwarms(prev => prev.map(swarm => 
      swarm.id === swarmId 
        ? { ...swarm, metrics: { ...swarm.metrics, ...metrics } }
        : swarm
    ));
  }, []);

  return (
    <SwarmContext.Provider value={{
      swarms,
      selectedSwarm,
      selectedAgent,
      selectSwarm,
      selectAgent,
      updateSwarmMetrics
    }}>
      {children}
    </SwarmContext.Provider>
  );
}

export function useSwarmContext() {
  const context = useContext(SwarmContext);
  if (context === undefined) {
    throw new Error('useSwarmContext must be used within a SwarmProvider');
  }
  return context;
}