import { useState, useEffect, useCallback } from 'react';
import { useSwarmContext } from '@/context/SwarmContext';

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'task_completed' | 'agent_spawned' | 'error' | 'system' | 'user_action';
  message: string;
  swarmId?: string;
  agentId?: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

export interface SystemMetrics {
  totalWorkflows: number;
  activeWorkflows: number;
  totalAgents: number;
  activeAgents: number;
  pendingApprovals: number;
  memoryUsage: number;
  systemUptime: number;
  lastUpdate: string;
}

export interface SwarmMetrics {
  swarmId: string;
  agentCount: number;
  activeAgents: number;
  tasksInProgress: number;
  avgResponseTime: number;
  successRate: number;
  memoryUsage: number;
}

export function useDashboardData() {
  const { selectedSwarm, selectedAgent, updateSwarmMetrics } = useSwarmContext();
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    totalWorkflows: 12,
    activeWorkflows: 3,
    totalAgents: 6,
    activeAgents: 5,
    pendingApprovals: 2,
    memoryUsage: 68,
    systemUptime: 99.1,
    lastUpdate: new Date().toISOString()
  });

  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      type: 'task_completed',
      message: 'Literature analysis completed successfully',
      swarmId: 'swarm-1',
      agentId: 'agent-1-1',
      severity: 'success'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      type: 'agent_spawned',
      message: 'New QA Tester agent initialized',
      swarmId: 'swarm-2',
      agentId: 'agent-2-3',
      severity: 'info'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      type: 'error',
      message: 'Agent connection timeout detected',
      swarmId: 'swarm-2',
      agentId: 'agent-2-3',
      severity: 'error'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      type: 'system',
      message: 'System memory optimization completed',
      severity: 'success'
    }
  ]);

  const generateRandomMetric = useCallback((base: number, variance: number) => {
    return Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance));
  }, []);

  const simulateNewActivity = useCallback(() => {
    const eventTypes = ['task_completed', 'system', 'user_action'] as const;
    const messages = [
      'Data processing workflow completed',
      'Agent memory optimization finished',
      'New workflow template created',
      'System health check passed',
      'Agent coordination improved',
      'Memory usage optimized',
      'Task queue processed',
      'Agent response time improved'
    ];

    const newEvent: ActivityEvent = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      swarmId: selectedSwarm?.id,
      severity: Math.random() > 0.8 ? 'warning' : 'success'
    };

    setActivityEvents(prev => [newEvent, ...prev.slice(0, 19)]); // Keep last 20 events
  }, [selectedSwarm]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update system metrics
      setSystemMetrics(prev => ({
        ...prev,
        activeWorkflows: Math.max(1, prev.activeWorkflows + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        activeAgents: Math.max(1, Math.min(prev.totalAgents, prev.activeAgents + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
        pendingApprovals: Math.max(0, prev.pendingApprovals + (Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        memoryUsage: generateRandomMetric(prev.memoryUsage, 10),
        systemUptime: Math.min(100, prev.systemUptime + (Math.random() - 0.5) * 0.1),
        lastUpdate: new Date().toISOString()
      }));

      // Update swarm metrics
      if (selectedSwarm) {
        updateSwarmMetrics(selectedSwarm.id, {
          completedTasks: selectedSwarm.metrics.completedTasks + (Math.random() > 0.8 ? 1 : 0),
          avgResponseTime: Math.max(0.1, selectedSwarm.metrics.avgResponseTime + (Math.random() - 0.5) * 0.2)
        });
      }

      // Occasionally add new activity
      if (Math.random() > 0.7) {
        simulateNewActivity();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedSwarm, updateSwarmMetrics, generateRandomMetric, simulateNewActivity]);

  const getSwarmMetrics = useCallback((): SwarmMetrics | null => {
    if (!selectedSwarm) return null;

    const activeAgents = selectedSwarm.agents.filter(agent => agent.status === 'active').length;
    const avgMemoryUsage = selectedSwarm.agents.reduce((sum, agent) => sum + agent.memoryUsage, 0) / selectedSwarm.agents.length;
    const successRate = selectedSwarm.metrics.totalTasks > 0 
      ? ((selectedSwarm.metrics.completedTasks / selectedSwarm.metrics.totalTasks) * 100)
      : 0;

    return {
      swarmId: selectedSwarm.id,
      agentCount: selectedSwarm.agents.length,
      activeAgents,
      tasksInProgress: selectedSwarm.metrics.totalTasks - selectedSwarm.metrics.completedTasks - selectedSwarm.metrics.failedTasks,
      avgResponseTime: selectedSwarm.metrics.avgResponseTime,
      successRate,
      memoryUsage: avgMemoryUsage
    };
  }, [selectedSwarm]);

  const getFilteredActivity = useCallback((limit: number = 10): ActivityEvent[] => {
    let filtered = activityEvents;

    if (selectedAgent) {
      filtered = filtered.filter(event => event.agentId === selectedAgent.id);
    } else if (selectedSwarm) {
      filtered = filtered.filter(event => !event.swarmId || event.swarmId === selectedSwarm.id);
    }

    return filtered.slice(0, limit);
  }, [activityEvents, selectedSwarm, selectedAgent]);

  return {
    systemMetrics,
    swarmMetrics: getSwarmMetrics(),
    activityEvents: getFilteredActivity(),
    refreshData: () => {
      setSystemMetrics(prev => ({ ...prev, lastUpdate: new Date().toISOString() }));
    }
  };
}