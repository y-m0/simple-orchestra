
import { useState, useEffect } from "react";
import { 
  AlertCircle, 
  Clock, 
  Calendar, 
  CheckSquare, 
  User, 
  FileCheck,
  Activity,
  ArrowRight,
  MessageSquare,
  Plus,
  Trash
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowRun, Workflow, WorkflowNode } from "@/types/workflow";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useToast } from "@/hooks/use-toast";

interface WorkflowDetailsProps {
  workflowId: string;
  onClose?: () => void;
}

export function WorkflowDetails({ workflowId, onClose }: WorkflowDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { 
    currentWorkflow, 
    workflowRuns, 
    nodes, 
    isRunning, 
    runWorkflow, 
    stopWorkflow,
    approveHumanTask,
    rejectHumanTask
  } = useWorkflow();
  const { toast } = useToast();
  
  // Filter runs for this workflow
  const filteredRuns = workflowRuns.filter(run => run.workflowId === workflowId);
  
  // Find human approval tasks
  const humanApprovalNodes = nodes.filter(node => 
    node.type === 'human' && node.requiresApproval && node.status === 'running'
  );

  // Track workflow runs for activity logging
  useEffect(() => {
    if (filteredRuns.length > 0) {
      const latestRun = filteredRuns[filteredRuns.length - 1];
      
      // Log to the activity log system when a run changes status
      if (latestRun.status === 'completed') {
        console.log(`Activity Log: Workflow ${workflowId} completed successfully at ${new Date().toLocaleTimeString()}`);
      } else if (latestRun.status === 'error') {
        console.log(`Activity Log: Workflow ${workflowId} failed at ${new Date().toLocaleTimeString()}`);
      }
    }
  }, [filteredRuns, workflowId]);
  
  // Apply workflow settings
  useEffect(() => {
    // Get workflow settings from global state
    const workflowDefaults = (window as any).workflowDefaults;
    
    if (workflowDefaults && currentWorkflow) {
      // Apply default settings to current workflow
      console.log(`Applied workflow settings to "${currentWorkflow.title}":`, workflowDefaults);
    }
  }, [currentWorkflow]);
  
  if (!currentWorkflow) return <div>No workflow selected</div>;

  const handleApproveTask = (nodeId: string) => {
    approveHumanTask(nodeId);
    
    // Push notification to activity log
    console.log(`Activity Log: Human task in workflow ${workflowId} approved at ${new Date().toLocaleTimeString()}`);
    
    // Remove approval from approvals inbox if applicable
    // This would integrate with a global approvals system
  };
  
  const handleRejectTask = (nodeId: string) => {
    rejectHumanTask(nodeId);
    
    // Push notification to activity log
    console.log(`Activity Log: Human task in workflow ${workflowId} rejected at ${new Date().toLocaleTimeString()}`);
    
    // Remove approval from approvals inbox if applicable
    // This would integrate with a global approvals system
  };
  
  const handleRunWorkflow = () => {
    runWorkflow();
    
    // Log to activity log
    console.log(`Activity Log: Workflow ${workflowId} started manually at ${new Date().toLocaleTimeString()}`);
    
    // Check for any missing agents
    const missingAgents = nodes
      .filter(node => node.type === 'agent' && node.agentId)
      .filter(node => {
        // Check if agent exists in directory
        // This is simplified - in a real app we'd check against agent directory
        const mockAgentDirectory = ["1", "2", "3", "4", "5"];
        return !mockAgentDirectory.includes(node.agentId || "");
      });
    
    if (missingAgents.length > 0) {
      toast({
        variant: "destructive",
        title: "Warning: Missing Agents",
        description: `${missingAgents.length} agent(s) in this workflow are not in the directory.`,
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{currentWorkflow.title}</h2>
          <Badge className={
            isRunning ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" :
            currentWorkflow.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
            currentWorkflow.status === "error" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" :
            "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
          }>
            {isRunning ? "Running" : currentWorkflow.status}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">{currentWorkflow.description}</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">Run History</TabsTrigger>
          <TabsTrigger value="approvals" className="relative">
            Approvals
            {humanApprovalNodes.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {humanApprovalNodes.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="flex-1 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="border rounded-md p-3">
              <div className="text-sm text-muted-foreground mb-1">Trigger</div>
              <div className="font-medium">{currentWorkflow.trigger}</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-sm text-muted-foreground mb-1">Complexity</div>
              <div className="font-medium capitalize">{currentWorkflow.complexity}</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-sm text-muted-foreground mb-1">Last Run</div>
              <div className="font-medium">{currentWorkflow.lastRunAt || 'Never'}</div>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="font-semibold mb-2">Workflow Properties</h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Created By:</span>
                <span className="ml-2">{currentWorkflow.createdBy || 'System'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Last Modified:</span>
                <span className="ml-2">{currentWorkflow.updatedAt || 'Not modified'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Total Runs:</span>
                <span className="ml-2">{currentWorkflow.totalRuns || 0}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Success Rate:</span>
                <span className="ml-2">{currentWorkflow.successRate || 0}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Avg. Run Time:</span>
                <span className="ml-2">{currentWorkflow.avgRunTime || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Organization:</span>
                <span className="ml-2">{currentWorkflow.orgId || 'Default'}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Workflow Steps Overview</h3>
            <div className="space-y-1">
              {nodes.map((node, index) => (
                <div key={node.id} className="flex items-center border rounded-md p-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{node.title}</div>
                    <div className="text-xs text-muted-foreground">{node.description}</div>
                  </div>
                  <Badge variant={
                    node.type === 'agent' ? 'default' : 
                    node.type === 'logic' ? 'secondary' : 
                    node.type === 'human' ? 'outline' : 'default'
                  }>
                    {node.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 flex-1">
          {filteredRuns.length > 0 ? (
            <div className="space-y-3">
              {filteredRuns.map((run) => (
                <div key={run.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Run ID: {run.id}</h4>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Started: {new Date(run.startTime).toLocaleString()}</span>
                        {run.endTime && (
                          <>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>Duration: {
                              Math.round((new Date(run.endTime).getTime() - new Date(run.startTime).getTime()) / 1000)
                            }s</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge className={
                      run.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                      run.status === "error" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" :
                      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    }>
                      {run.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-xs border-t pt-2">
                    <User className="h-3 w-3 mr-1" />
                    <span>Triggered by: {run.triggeredBy}</span>
                    <div className="flex-1 text-right">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                  
                  {run.status === "error" && run.nodeRuns.some(nr => nr.error) && (
                    <div className="mt-2 p-2 bg-red-50 text-red-800 rounded-md text-xs flex items-start">
                      <AlertCircle className="h-3 w-3 mr-1 mt-0.5" />
                      <div>
                        <div className="font-medium">Error</div>
                        <div>{run.nodeRuns.find(nr => nr.error)?.error}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md">
              <FileCheck className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="font-medium mb-1">No run history</h3>
              <p className="text-sm text-muted-foreground">This workflow hasn't been executed yet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="approvals" className="space-y-4 flex-1">
          {humanApprovalNodes.length > 0 ? (
            <div className="space-y-3">
              {humanApprovalNodes.map((node) => (
                <div key={node.id} className="border rounded-md p-3 border-l-4 border-l-yellow-500">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{node.title}</h4>
                      <div className="text-xs text-muted-foreground">{node.description}</div>
                      {node.approvalAssignee && (
                        <div className="text-xs flex items-center mt-1">
                          <User className="h-3 w-3 mr-1" />
                          <span>Assignee: {node.approvalAssignee}</span>
                          {node.approvalDeadline && (
                            <>
                              <span className="mx-1">•</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>Due: {node.approvalDeadline}</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      Awaiting Approval
                    </Badge>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => handleRejectTask(node.id)}
                    >
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleApproveTask(node.id)}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md">
              <CheckSquare className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="font-medium mb-1">No pending approvals</h3>
              <p className="text-sm text-muted-foreground">There are no steps requiring approval at this time</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="border-t mt-4 pt-4 flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Clone
          </Button>
          <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50">
            <Trash className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
        <div className="flex gap-2">
          {isRunning ? (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={stopWorkflow}
            >
              Stop Workflow
            </Button>
          ) : (
            <Button 
              size="sm"
              onClick={handleRunWorkflow}
            >
              Run Workflow
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
