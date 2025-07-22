// import React from 'react';
import { DashboardPanel } from './DashboardLayout';
import { useSwarmContext } from '@/context/SwarmContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  XCircle, 
  // AlertTriangle, 
  Info, 
  Users, 
  Activity,
  Clock,
  Zap
} from 'lucide-react';

const eventIcons = {
  task_completed: CheckCircle,
  agent_spawned: Users,
  error: XCircle,
  system: Activity,
  user_action: Zap
};

const severityColors = {
  success: 'text-green-600 bg-green-50 border-green-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  warning: 'text-orange-600 bg-orange-50 border-orange-200',
  info: 'text-blue-600 bg-blue-50 border-blue-200'
};

const severityBadgeColors = {
  success: 'bg-green-100 text-green-800 border-green-300',
  error: 'bg-red-100 text-red-800 border-red-300',
  warning: 'bg-orange-100 text-orange-800 border-orange-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300'
};

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const eventTime = new Date(timestamp);
  const diffMs = now.getTime() - eventTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function RecentActivity() {
  const { selectedSwarm, selectedAgent } = useSwarmContext();
  const { activityEvents } = useDashboardData();

  const getFilteredEvents = () => {
    if (selectedAgent) {
      return activityEvents.filter(event => event.agentId === selectedAgent.id);
    }
    if (selectedSwarm) {
      return activityEvents.filter(event => 
        !event.swarmId || event.swarmId === selectedSwarm.id
      );
    }
    return activityEvents;
  };

  const filteredEvents = getFilteredEvents();

  const getTitle = () => {
    if (selectedAgent) return `Activity: ${selectedAgent.name}`;
    if (selectedSwarm) return `Activity: ${selectedSwarm.name}`;
    return 'Recent Activity';
  };

  const getDescription = () => {
    if (selectedAgent) return 'Individual agent activity and events';
    if (selectedSwarm) return 'Swarm-wide activity and coordination events';
    return 'System-wide activity across all swarms and agents';
  };

  return (
    <DashboardPanel 
      title={getTitle()}
      description={getDescription()}
    >
      <div className="space-y-4">
        {/* Activity Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
            <div className="text-lg font-bold text-green-600">
              {filteredEvents.filter(e => e.severity === 'success').length}
            </div>
            <div className="text-xs text-green-700 dark:text-green-400">Success</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20">
            <div className="text-lg font-bold text-blue-600">
              {filteredEvents.filter(e => e.severity === 'info').length}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-400">Info</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-orange-50 dark:bg-orange-950/20">
            <div className="text-lg font-bold text-orange-600">
              {filteredEvents.filter(e => e.severity === 'warning').length}
            </div>
            <div className="text-xs text-orange-700 dark:text-orange-400">Warning</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
            <div className="text-lg font-bold text-red-600">
              {filteredEvents.filter(e => e.severity === 'error').length}
            </div>
            <div className="text-xs text-red-700 dark:text-red-400">Error</div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">Activity Feed</h4>
            <Badge variant="secondary" className="text-xs">
              Live • {filteredEvents.length} events
            </Badge>
          </div>
          
          <ScrollArea className="h-64 pr-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEvents.map((event) => {
                  const EventIcon = eventIcons[event.type] || Info;
                  return (
                    <div 
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-1.5 rounded-full border ${severityColors[event.severity]}`}>
                        <EventIcon className="h-3 w-3" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-tight">
                            {event.message}
                          </p>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Badge 
                              variant="outline" 
                              className={`text-xs px-1.5 py-0.5 ${severityBadgeColors[event.severity]}`}
                            >
                              {event.severity}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatRelativeTime(event.timestamp)}
                          </div>
                          
                          {event.agentId && (
                            <Badge variant="outline" className="text-xs">
                              Agent
                            </Badge>
                          )}
                          
                          {event.swarmId && !selectedSwarm && (
                            <Badge variant="outline" className="text-xs">
                              Swarm
                            </Badge>
                          )}
                          
                          <Badge variant="secondary" className="text-xs capitalize">
                            {event.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Activity Summary */}
        {filteredEvents.length > 0 && (
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                Showing {filteredEvents.length} recent events
              </div>
              <div className="text-muted-foreground">
                Last updated: {formatRelativeTime(filteredEvents[0]?.timestamp || new Date().toISOString())}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardPanel>
  );
}