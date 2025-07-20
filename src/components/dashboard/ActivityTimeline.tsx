import { Activity as ActivityIcon, Calendar, Clock, User, CheckCircle2, XCircle, CirclePause, MessageSquare, Settings, FolderOpen } from "lucide-react";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useState, useEffect } from "react";
import { useStore, Activity } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
  workflowId?: string;
  nodeId?: string;
  agentId?: string;
  type?: 'workflow' | 'agent' | 'approval' | 'memory' | 'tool' | 'system';
  metadata?: Record<string, any>;
}

interface ActivityTimelineProps {
  items?: TimelineItem[];
  maxItems?: number;
  onItemClick?: (item: TimelineItem) => void;
  showFilters?: boolean;
}

export function ActivityTimeline({ 
  items: propItems, 
  maxItems = 5, 
  onItemClick,
  showFilters = false
}: ActivityTimelineProps) {
  const { workflowRuns } = useWorkflow();
  const [items, setItems] = useState<TimelineItem[]>(propItems || []);
  const [filterType, setFilterType] = useState<string>('all');
  const { activities } = useStore();
  
  useEffect(() => {
    if (propItems) {
      setItems(propItems);
      return;
    }
    
    // Set up console interceptor for activity logging
    const consoleLog = console.log;
    const activityLogs: TimelineItem[] = [];
    
    console.log = function(message: unknown, ...optionalParams: unknown[]) {
      consoleLog.apply(console, [message, ...optionalParams]);
      
      if (typeof message === 'string' && message.startsWith('Activity Log:')) {
        const logMessage = message.substring('Activity Log:'.length).trim();
        const timestamp = new Date().toISOString();
        
        // Extract workflow ID if present
        const workflowMatch = logMessage.match(/Workflow\s+([a-zA-Z0-9-]+)/i);
        const workflowId = workflowMatch ? workflowMatch[1] : undefined;
        
        // Extract agent ID if present
        const agentMatch = logMessage.match(/Agent\s+([a-zA-Z0-9-]+)/i);
        const agentId = agentMatch ? agentMatch[1] : undefined;
        
        // Determine the type of activity
        let type: 'workflow' | 'agent' | 'approval' | 'memory' | 'tool' | 'system' = 'system';
        if (logMessage.includes('workflow')) type = 'workflow';
        else if (logMessage.includes('agent')) type = 'agent';
        else if (logMessage.includes('approv')) type = 'approval';
        else if (logMessage.includes('memory') || logMessage.includes('context')) type = 'memory';
        else if (logMessage.includes('tool')) type = 'tool';
        
        // Determine status based on keywords
        const statusMatch = logMessage.match(/(completed|failed|started|created|updated|approved|rejected|pending)/i);
        const status = statusMatch 
          ? statusMatch[1].toLowerCase() === 'completed' || statusMatch[1].toLowerCase() === 'approved' ? 'success' 
          : statusMatch[1].toLowerCase() === 'failed' || statusMatch[1].toLowerCase() === 'rejected' ? 'error'
          : 'pending'
          : 'pending';
        
        activityLogs.unshift({
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: logMessage.split('at')[0].trim(),
          description: logMessage.includes('at') ? `at ${logMessage.split('at')[1].trim()}` : '',
          timestamp,
          status,
          workflowId,
          agentId,
          type
        });
        
        setItems(prev => [...activityLogs, ...prev].slice(0, maxItems));
      }
    };
    
    // Convert workflow runs into timeline items
    const workflowRunItems: TimelineItem[] = workflowRuns
      .slice()
      .reverse()
      .slice(0, maxItems)
      .map((run: any) => {
        const status = run.status === 'completed' ? 'success' : 
                      run.status === 'running' ? 'pending' : 'error';
                      
        return {
          id: run.id,
          title: `Workflow ${run.workflowId.slice(-5)} ${run.status}`,
          description: `${run.nodeRuns.length} nodes processed`,
          timestamp: new Date(run.startTime).toLocaleString(),
          status,
          workflowId: run.workflowId,
          type: 'workflow'
        };
      });
    
    // Capture store activities
    const storeActivityItems: TimelineItem[] = activities.slice(0, maxItems).map((activity: Activity) => {
      const status = 
        activity.type.includes('completed') || activity.type.includes('approved') ? 'success' :
        activity.type.includes('failed') || activity.type.includes('rejected') || activity.type.includes('error') ? 'error' :
        'pending';
      
      let type: 'workflow' | 'agent' | 'approval' | 'memory' | 'tool' | 'system' = 'system';
      if (activity.type.includes('workflow')) type = 'workflow';
      else if (activity.type.includes('agent')) type = 'agent';
      else if (activity.type.includes('task') || activity.type.includes('approv')) type = 'approval';
      else if (activity.type.includes('memory')) type = 'memory';
      else if (activity.type.includes('tool')) type = 'tool';
      
      // Convert complex details to string if necessary
      let description: string = typeof activity.details === 'string' 
        ? activity.details 
        : JSON.stringify(activity.details);
      
      return {
        id: activity.id,
        title: activity.type.replace(/_/g, ' '),
        description,
        timestamp: new Date(activity.timestamp).toLocaleString(),
        status,
        type,
        metadata: { raw: activity }
      };
    });
    
    // Combine all sources of activities
    const allItems = [
      ...activityLogs, 
      ...workflowRunItems,
      ...storeActivityItems
    ].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, maxItems);
    
    setItems(allItems);
    
    return () => {
      console.log = consoleLog;
    };
  }, [propItems, workflowRuns, maxItems, activities]);
  
  // Apply filtering based on selected type
  const filteredItems = filterType === 'all' 
    ? items 
    : items.filter(item => item.type === filterType);
  
  const handleItemClick = (item: TimelineItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      console.log("Activity item clicked:", item);
    }
  };
  
  const getActivityIcon = (type?: string, status?: string) => {
    switch (type) {
      case 'workflow':
        return <FolderOpen className="h-4 w-4" />;
      case 'agent':
        return <User className="h-4 w-4" />;
      case 'approval':
        return status === 'success' ? <CheckCircle2 className="h-4 w-4" /> : 
               status === 'error' ? <XCircle className="h-4 w-4" /> :
               <CirclePause className="h-4 w-4" />;
      case 'memory':
        return <MessageSquare className="h-4 w-4" />;
      case 'tool':
        return <Settings className="h-4 w-4" />;
      default:
        return <ActivityIcon className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border dark:bg-[#1A1F2C] dark:border-[#403E43]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ActivityIcon className="h-5 w-5 text-primary dark:text-[#9b87f5]" />
          <span className="dark:text-foreground">System Activity</span>
        </h2>
        {showFilters && (
          <div className="flex items-center gap-2">
            <select 
              className="text-xs rounded-md border border-border bg-background px-2 py-1"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="workflow">Workflows</option>
              <option value="agent">Agents</option>
              <option value="approval">Approvals</option>
              <option value="memory">Memory</option>
              <option value="tool">Tools</option>
              <option value="system">System</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="flex gap-4 cursor-pointer hover:bg-accent/10 dark:hover:bg-accent/20 p-2 rounded transition-colors"
              onClick={() => handleItemClick(item)}
            >
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-full ${
                  item.status === 'success' ? 'bg-green-500 dark:bg-green-400' :
                  item.status === 'pending' ? 'bg-yellow-500 dark:bg-yellow-400' : 'bg-red-500 dark:bg-red-400'
                }`} />
                <div className="w-px flex-1 my-1 bg-border dark:bg-[#403E43]" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium dark:text-foreground">{item.title}</p>
                  {item.type && (
                    <Badge variant="outline" className="h-5 text-xs">
                      <div className="flex items-center gap-1">
                        {getActivityIcon(item.type, item.status)}
                        <span className="capitalize">{item.type}</span>
                      </div>
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground/80">{item.description}</p>
                <div className="flex items-center text-xs text-muted-foreground dark:text-muted-foreground/60 mt-1 gap-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground dark:text-muted-foreground/70 py-4">No recent activity</p>
        )}
      </div>
    </div>
  );
}
