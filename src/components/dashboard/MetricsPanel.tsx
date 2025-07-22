// import React from 'react';
import { MetricCard, DashboardPanel } from './DashboardLayout';
import { useSwarmContext } from '@/context/SwarmContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { 
  Activity, 
  Users, 
  Clock, 
  MemoryStick, 
  CheckCircle, 
  // AlertTriangle,
  Zap,
  Target
} from 'lucide-react';

export function MetricsPanel() {
  const { selectedSwarm, selectedAgent } = useSwarmContext();
  const { systemMetrics, swarmMetrics } = useDashboardData();

  if (selectedAgent) {
    return (
      <DashboardPanel 
        title={`Agent Metrics: ${selectedAgent.name}`}
        description="Individual agent performance and status"
        glowing={selectedAgent.status === 'active'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Status"
            value={selectedAgent.status}
            color={selectedAgent.status === 'active' ? 'success' : 
                  selectedAgent.status === 'error' ? 'error' : 'warning'}
            icon={<Activity className="h-4 w-4" />}
            subtitle={`Last active: ${selectedAgent.lastActivity}`}
          />
          <MetricCard
            title="Uptime"
            value={`${selectedAgent.uptime.toFixed(1)}%`}
            color="info"
            icon={<Clock className="h-4 w-4" />}
            trend={selectedAgent.uptime > 95 ? 'up' : 'down'}
          />
          <MetricCard
            title="Tasks Completed"
            value={selectedAgent.tasksCompleted}
            color="success"
            icon={<CheckCircle className="h-4 w-4" />}
            subtitle="Total completed"
          />
          <MetricCard
            title="Memory Usage"
            value={`${selectedAgent.memoryUsage}%`}
            color={selectedAgent.memoryUsage > 80 ? 'warning' : 'info'}
            icon={<MemoryStick className="h-4 w-4" />}
            trend={selectedAgent.memoryUsage > 70 ? 'up' : 'neutral'}
          />
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-muted/20">
          <div className="text-sm font-medium text-muted-foreground mb-2">Agent Details</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Type:</span>
              <span className="ml-2 font-medium capitalize">{selectedAgent.type}</span>
            </div>
            <div>
              <span className="text-muted-foreground">ID:</span>
              <span className="ml-2 font-mono text-xs">{selectedAgent.id}</span>
            </div>
          </div>
        </div>
      </DashboardPanel>
    );
  }

  if (selectedSwarm && swarmMetrics) {
    return (
      <DashboardPanel 
        title={`Swarm Metrics: ${selectedSwarm.name}`}
        description="Collective swarm performance and coordination"
        glowing={selectedSwarm.status === 'active'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            title="Active Agents"
            value={`${swarmMetrics.activeAgents}/${swarmMetrics.agentCount}`}
            color="success"
            icon={<Users className="h-4 w-4" />}
            subtitle={`${((swarmMetrics.activeAgents / swarmMetrics.agentCount) * 100).toFixed(0)}% active`}
          />
          <MetricCard
            title="Tasks in Progress"
            value={swarmMetrics.tasksInProgress}
            color="info"
            icon={<Activity className="h-4 w-4" />}
            subtitle="Currently processing"
          />
          <MetricCard
            title="Avg Response Time"
            value={`${swarmMetrics.avgResponseTime.toFixed(1)}s`}
            color={swarmMetrics.avgResponseTime < 2 ? 'success' : 'warning'}
            icon={<Zap className="h-4 w-4" />}
            trend={swarmMetrics.avgResponseTime < 2 ? 'up' : 'down'}
          />
          <MetricCard
            title="Success Rate"
            value={`${swarmMetrics.successRate.toFixed(1)}%`}
            color={swarmMetrics.successRate > 90 ? 'success' : 'warning'}
            icon={<Target className="h-4 w-4" />}
            trend={swarmMetrics.successRate > 90 ? 'up' : 'down'}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/20">
            <div className="text-sm font-medium text-muted-foreground mb-2">Task Summary</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">{selectedSwarm.metrics.totalTasks}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-medium text-green-600">{selectedSwarm.metrics.completedTasks}</span>
              </div>
              <div className="flex justify-between">
                <span>Failed:</span>
                <span className="font-medium text-red-600">{selectedSwarm.metrics.failedTasks}</span>
              </div>
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/20">
            <div className="text-sm font-medium text-muted-foreground mb-2">Memory Usage</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${swarmMetrics.memoryUsage}%` }}
                />
              </div>
              <span className="text-sm font-medium">{swarmMetrics.memoryUsage.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </DashboardPanel>
    );
  }

  // System-wide metrics
  return (
    <DashboardPanel 
      title="System Metrics"
      description="Overall orchestration platform performance"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Workflows"
          value={`${systemMetrics.activeWorkflows}/${systemMetrics.totalWorkflows}`}
          color="success"
          icon={<Activity className="h-4 w-4" />}
          subtitle="Currently running"
        />
        <MetricCard
          title="Active Agents"
          value={`${systemMetrics.activeAgents}/${systemMetrics.totalAgents}`}
          color="info"
          icon={<Users className="h-4 w-4" />}
          subtitle="Across all swarms"
        />
        <MetricCard
          title="Pending Approvals"
          value={systemMetrics.pendingApprovals}
          color={systemMetrics.pendingApprovals > 5 ? 'warning' : 'success'}
          icon={<Clock className="h-4 w-4" />}
          subtitle="Require attention"
        />
        <MetricCard
          title="System Uptime"
          value={`${systemMetrics.systemUptime.toFixed(1)}%`}
          color="success"
          icon={<CheckCircle className="h-4 w-4" />}
          trend="up"
        />
      </div>

      <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/10">
        <div className="flex items-center gap-2 mb-2">
          <MemoryStick className="h-4 w-4 text-purple-600" />
          <span className="font-medium">Memory Usage</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-muted rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${systemMetrics.memoryUsage}%` }}
            />
          </div>
          <span className="font-medium text-lg">{systemMetrics.memoryUsage.toFixed(0)}%</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {new Date(systemMetrics.lastUpdate).toLocaleTimeString()}
        </p>
      </div>
    </DashboardPanel>
  );
}