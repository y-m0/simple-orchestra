// import React from 'react';
import { DashboardPanel } from './DashboardLayout';
import { useSwarmContext } from '@/context/SwarmContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Clock, 
  Wifi, 
  Database,
  Server,
  Shield
} from 'lucide-react';

const statusIcons = {
  active: CheckCircle2,
  idle: Clock,
  error: XCircle,
  offline: AlertCircle
};

const statusColors = {
  active: 'text-green-600 bg-green-50 border-green-200',
  idle: 'text-orange-600 bg-orange-50 border-orange-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  offline: 'text-gray-600 bg-gray-50 border-gray-200'
};

export function HealthStatus() {
  const { selectedSwarm, selectedAgent } = useSwarmContext();
  const { systemMetrics } = useDashboardData();

  if (selectedAgent) {
    const StatusIcon = statusIcons[selectedAgent.status];
    
    return (
      <DashboardPanel 
        title={`Agent Health: ${selectedAgent.name}`}
        description="Individual agent health and diagnostics"
      >
        <div className="space-y-4">
          {/* Agent Status */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
            <div className={`p-2 rounded-full ${statusColors[selectedAgent.status]}`}>
              <StatusIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-semibold capitalize">{selectedAgent.status}</div>
              <div className="text-sm text-muted-foreground">
                Last activity: {selectedAgent.lastActivity}
              </div>
            </div>
            <Badge variant="outline" className="capitalize">
              {selectedAgent.type}
            </Badge>
          </div>

          {/* Health Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Uptime</span>
              </div>
              <div className="text-2xl font-bold">
                {selectedAgent.uptime.toFixed(1)}%
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    selectedAgent.uptime > 95 ? 'bg-green-500' :
                    selectedAgent.uptime > 85 ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${selectedAgent.uptime}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Performance</span>
              </div>
              <div className="text-2xl font-bold">
                {selectedAgent.tasksCompleted}
              </div>
              <div className="text-sm text-muted-foreground">Tasks completed</div>
            </div>
          </div>

          {/* Diagnostics */}
          <div className="p-4 rounded-lg bg-muted/20">
            <h4 className="font-medium mb-3">Diagnostics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Memory Usage:</span>
                <span className={`font-medium ${
                  selectedAgent.memoryUsage > 80 ? 'text-red-600' :
                  selectedAgent.memoryUsage > 60 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {selectedAgent.memoryUsage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Connection:</span>
                <span className="text-green-600 font-medium">Stable</span>
              </div>
              <div className="flex justify-between">
                <span>Last Response:</span>
                <span className="text-green-600 font-medium">&lt; 1s</span>
              </div>
            </div>
          </div>
        </div>
      </DashboardPanel>
    );
  }

  if (selectedSwarm) {
    const activeAgents = selectedSwarm.agents.filter(agent => agent.status === 'active').length;
    const errorAgents = selectedSwarm.agents.filter(agent => agent.status === 'error').length;
    const healthScore = ((activeAgents / selectedSwarm.agents.length) * 100);

    return (
      <DashboardPanel 
        title={`Swarm Health: ${selectedSwarm.name}`}
        description="Collective swarm health and agent status"
      >
        <div className="space-y-4">
          {/* Overall Health Score */}
          <div className="text-center p-6 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {healthScore.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground">Health Score</div>
            <div className="w-full bg-muted rounded-full h-3 mt-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>

          {/* Agent Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedSwarm.agents.map((agent) => {
              const StatusIcon = statusIcons[agent.status];
              return (
                <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                  <div className={`p-2 rounded-full ${statusColors[agent.status]}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{agent.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {agent.uptime.toFixed(1)}% uptime
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {agent.type}
                  </Badge>
                </div>
              );
            })}
          </div>

          {/* Health Summary */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="text-lg font-bold text-green-600">{activeAgents}</div>
              <div className="text-xs text-green-700 dark:text-green-400">Active</div>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
              <div className="text-lg font-bold text-orange-600">
                {selectedSwarm.agents.filter(a => a.status === 'idle').length}
              </div>
              <div className="text-xs text-orange-700 dark:text-orange-400">Idle</div>
            </div>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
              <div className="text-lg font-bold text-red-600">{errorAgents}</div>
              <div className="text-xs text-red-700 dark:text-red-400">Error</div>
            </div>
          </div>
        </div>
      </DashboardPanel>
    );
  }

  // System Health
  return (
    <DashboardPanel 
      title="System Health"
      description="Overall platform health and infrastructure status"
    >
      <div className="space-y-4">
        {/* System Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="p-2 rounded-full bg-green-50 text-green-600">
              <Wifi className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">API Gateway</div>
              <div className="text-sm text-green-600">Online</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="p-2 rounded-full bg-green-50 text-green-600">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">Database</div>
              <div className="text-sm text-green-600">Connected</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="p-2 rounded-full bg-blue-50 text-blue-600">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">Orchestrator</div>
              <div className="text-sm text-blue-600">Demo Mode</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
            <div className="p-2 rounded-full bg-green-50 text-green-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold">Security</div>
              <div className="text-sm text-green-600">Protected</div>
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="p-4 rounded-lg bg-muted/30">
          <h4 className="font-medium mb-3">System Metrics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Total Workflows</div>
              <div className="font-semibold">{systemMetrics.totalWorkflows}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Active Workflows</div>
              <div className="font-semibold">{systemMetrics.activeWorkflows}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Total Agents</div>
              <div className="font-semibold">{systemMetrics.totalAgents}</div>
            </div>
            <div>
              <div className="text-muted-foreground">System Uptime</div>
              <div className="font-semibold">{systemMetrics.systemUptime.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
}