
import { useState, useEffect } from "react";
import { Search, Filter, Clock, Check, XCircle, AlertTriangle, Workflow } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useWorkflow } from "@/hooks/useWorkflow";

interface ActivityLog {
  id: string;
  agent?: string;
  action: string;
  time: string;
  outcome: 'success' | 'failure' | 'error' | 'pending';
  workflowId?: string;
  nodeId?: string;
  type?: 'workflow' | 'agent' | 'system';
}

export default function ActivityLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const navigate = useNavigate();
  const { workflowRuns } = useWorkflow();
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  
  // Static mock activities
  const mockActivities: ActivityLog[] = [
    {
      id: "1",
      agent: "Data Analyst Agent",
      action: "Processed monthly financial report",
      time: "10 minutes ago",
      outcome: "success",
      type: "agent"
    },
    {
      id: "2",
      agent: "Customer Support Bot",
      action: "Responded to customer inquiry #12345",
      time: "30 minutes ago",
      outcome: "success",
      type: "agent"
    },
    {
      id: "3",
      agent: "Marketing Analytics",
      action: "Generated campaign performance metrics",
      time: "1 hour ago",
      outcome: "failure",
      type: "agent"
    },
    {
      id: "4",
      agent: "Inventory Manager",
      action: "Stock level verification",
      time: "2 hours ago",
      outcome: "error",
      type: "agent"
    },
    {
      id: "5",
      agent: "HR Document Processor",
      action: "Validated new employee documents",
      time: "3 hours ago",
      outcome: "success",
      type: "agent"
    }
  ];
  
  // Generate workflow-related activities from runs
  useEffect(() => {
    const workflowActivities: ActivityLog[] = workflowRuns.map(run => {
      return {
        id: `wf-${run.id}`,
        action: `Workflow ${run.workflowId} ${run.status}`,
        time: new Date(run.startTime).toLocaleString(),
        outcome: run.status === 'completed' ? 'success' : 
                run.status === 'error' ? 'failure' : 'pending',
        workflowId: run.workflowId,
        type: 'workflow'
      };
    });
    
    // Intercept console logs about workflow activities
    const originalConsoleLog = console.log;
    console.log = function(message, ...args) {
      originalConsoleLog.apply(console, [message, ...args]);
      
      if (typeof message === 'string' && message.startsWith('Activity Log:')) {
        const logMessage = message.substring('Activity Log:'.length).trim();
        const timestamp = new Date().toLocaleTimeString();
        
        // Extract workflow ID and status from log message if possible
        const workflowMatch = logMessage.match(/Workflow\s+([a-zA-Z0-9-]+)/i);
        const workflowId = workflowMatch ? workflowMatch[1] : undefined;
        
        const statusMatch = logMessage.match(/(completed|failed|started|created|updated|stopped)/i);
        const outcome = statusMatch 
          ? statusMatch[1].toLowerCase() === 'completed' ? 'success' 
          : statusMatch[1].toLowerCase() === 'failed' ? 'failure'
          : statusMatch[1].toLowerCase() === 'started' ? 'pending'
          : 'pending'
          : 'pending';
        
        const newLog: ActivityLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          action: logMessage,
          time: `at ${timestamp}`,
          outcome,
          workflowId,
          type: 'workflow'
        };
        
        setActivityLogs(logs => {
          // Ensure we don't add duplicate logs
          const exists = logs.some(log => log.action === newLog.action && log.time === newLog.time);
          if (!exists) {
            return [newLog, ...logs];
          }
          return logs;
        });
      }
    };
    
    // Combine mock and workflow activities
    const combinedActivities = [...mockActivities, ...workflowActivities, ...activityLogs];
    setActivityLogs(combinedActivities);
    
    // Clean up
    return () => {
      console.log = originalConsoleLog;
    };
  }, [workflowRuns]);
  
  // Filter activities based on search query and filters
  const filteredActivities = activityLogs.filter(activity => 
    // Search filter
    ((activity.agent?.toLowerCase().includes(searchQuery.toLowerCase()) || false) || 
     activity.action.toLowerCase().includes(searchQuery.toLowerCase())) && 
    // Time filter 
    (timeFilter === "all" || true) && // Mock time filtering, would use real logic here
    // Type filter
    (typeFilter === "all" || activity.type === typeFilter)
  );
  
  // Navigate to workflow
  const navigateToWorkflow = (workflowId?: string, nodeId?: string) => {
    if (workflowId) {
      navigate(`/workflows?id=${workflowId}${nodeId ? `&node=${nodeId}` : ''}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Task Feed / Activity Log</h1>
      
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px]">
            <Clock className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Activity Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="workflow">Workflows</SelectItem>
            <SelectItem value="agent">Agents</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Recent Activities ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">
                    {activity.type === 'workflow' ? (
                      <div className="flex items-center">
                        <Workflow className="h-4 w-4 mr-1 text-blue-500" />
                        <span>Workflow</span>
                      </div>
                    ) : (
                      activity.agent
                    )}
                  </TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell>{activity.time}</TableCell>
                  <TableCell>
                    {activity.outcome === "success" && (
                      <div className="flex items-center">
                        <Check className="h-4 w-4 mr-1 text-green-500" />
                        <span>Success</span>
                      </div>
                    )}
                    {activity.outcome === "failure" && (
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 mr-1 text-red-500" />
                        <span>Failure</span>
                      </div>
                    )}
                    {activity.outcome === "error" && (
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>Error</span>
                      </div>
                    )}
                    {activity.outcome === "pending" && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-blue-500" />
                        <span>Running</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {activity.workflowId ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigateToWorkflow(activity.workflowId, activity.nodeId)}
                      >
                        View Workflow
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">View Details</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
