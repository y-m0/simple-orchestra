import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSwarmContext } from '@/context/SwarmContext';
import { Network, Users, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

const topologyIcons = {
  mesh: Network,
  hierarchical: Users,
  ring: Activity,
  star: CheckCircle2
};

const statusColors = {
  active: 'bg-green-500/10 text-green-700 border-green-500/20',
  initializing: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  paused: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
  error: 'bg-red-500/10 text-red-700 border-red-500/20'
};

export function SwarmSwitcher() {
  const { swarms, selectedSwarm, selectedAgent, selectSwarm, selectAgent } = useSwarmContext();

  return (
    <div className="space-y-4">
      {/* Swarm Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Active Swarm</label>
        <Select
          value={selectedSwarm?.id || ''}
          onValueChange={selectSwarm}
        >
          <SelectTrigger className="w-full bg-background/50 border-purple-500/20">
            <SelectValue placeholder="Select a swarm..." />
          </SelectTrigger>
          <SelectContent>
            {swarms.map((swarm) => {
              const TopologyIcon = topologyIcons[swarm.topology];
              return (
                <SelectItem key={swarm.id} value={swarm.id} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 w-full">
                    <TopologyIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium">{swarm.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {swarm.agents.length} agents • {swarm.topology}
                      </div>
                    </div>
                    <Badge 
                      className={statusColors[swarm.status]}
                      variant="outline"
                    >
                      {swarm.status}
                    </Badge>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Swarm Info */}
      {selectedSwarm && (
        <div className="p-4 rounded-lg bg-muted/30 border border-purple-500/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded bg-purple-500/10">
              {React.createElement(topologyIcons[selectedSwarm.topology], {
                className: "h-4 w-4 text-purple-600"
              })}
            </div>
            <h3 className="font-semibold">{selectedSwarm.name}</h3>
            <Badge className={statusColors[selectedSwarm.status]} variant="outline">
              {selectedSwarm.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {selectedSwarm.description}
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Topology:</span>
              <span className="ml-1 font-medium capitalize">{selectedSwarm.topology}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Agents:</span>
              <span className="ml-1 font-medium">{selectedSwarm.agents.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Agent Selection */}
      {selectedSwarm && selectedSwarm.agents.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">Focus Agent</label>
            {selectedAgent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => selectAgent(null)}
                className="text-xs h-6"
              >
                View All
              </Button>
            )}
          </div>
          <div className="grid gap-2">
            {selectedSwarm.agents.map((agent) => {
              const isSelected = selectedAgent?.id === agent.id;
              const statusIcon = agent.status === 'active' ? CheckCircle2 : 
                                agent.status === 'error' ? AlertCircle : Activity;
              
              return (
                <button
                  key={agent.id}
                  onClick={() => selectAgent(isSelected ? null : agent.id)}
                  className={`
                    w-full p-3 rounded-lg text-left transition-all
                    ${isSelected 
                      ? 'bg-purple-500/10 border border-purple-500/30 ring-1 ring-purple-500/20' 
                      : 'bg-background/50 border border-border/40 hover:bg-muted/40'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {React.createElement(statusIcon, {
                      className: `h-3 w-3 ${
                        agent.status === 'active' ? 'text-green-500' :
                        agent.status === 'error' ? 'text-red-500' : 'text-orange-500'
                      }`
                    })}
                    <span className="font-medium text-sm">{agent.name}</span>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {agent.type}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>Uptime: {agent.uptime.toFixed(1)}%</span>
                    <span>Tasks: {agent.tasksCompleted}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}