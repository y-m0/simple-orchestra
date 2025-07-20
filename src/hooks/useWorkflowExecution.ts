
import { useCallback, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { WorkflowNode, WorkflowConnection, Workflow, WorkflowRun } from '@/types/workflow';

export const useWorkflowExecution = (
  nodes: WorkflowNode[],
  connections: WorkflowConnection[],
  currentWorkflow: Workflow | null,
  isRunning: boolean,
  setIsRunning: (isRunning: boolean) => void,
  updateNodeStatus: (id: string, status: WorkflowNode['status']) => void,
  setWorkflowRuns: (runs: WorkflowRun[] | ((prev: WorkflowRun[]) => WorkflowRun[])) => void,
) => {
  const { toast } = useToast();
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);

  const logWorkflowActivity = useCallback((workflow: Workflow, status: 'started' | 'completed' | 'failed') => {
    // Push to activity log
    const activityMessage = `Workflow ${workflow.title} ${status} at ${new Date().toLocaleTimeString()}`;
    console.log("Activity Log:", activityMessage);
    
    // We could dispatch to a global activity log store here
  }, []);

  const runWorkflow = useCallback(() => {
    if (isRunning || !currentWorkflow) return;
    
    setIsRunning(true);
    setCurrentNodeIndex(0);
    
    // Create a new workflow run
    const newRun: WorkflowRun = {
      id: `run-${Date.now()}`,
      workflowId: currentWorkflow.id,
      status: 'running',
      startTime: new Date().toISOString(),
      triggeredBy: 'Current User', // This would be replaced by actual user info
      nodeRuns: []
    };
    
    // Add the run to the workflow runs
    setWorkflowRuns((prev: WorkflowRun[]) => [...prev, newRun]);
    
    // Log the workflow start activity
    logWorkflowActivity(currentWorkflow, 'started');
    
    toast({
      title: "Workflow Started",
      description: `Running: ${currentWorkflow.title}`,
    });
    
    // Start execution of first node
    const startNodes = nodes.filter(node => 
      !connections.some(conn => conn.target === node.id)
    );
    
    if (startNodes.length === 0) {
      toast({
        variant: "destructive",
        title: "Workflow Error",
        description: "No starting node found",
      });
      setIsRunning(false);
      
      // Log the workflow failure
      logWorkflowActivity(currentWorkflow, 'failed');
      return;
    }
    
    // Execute each starting node
    startNodes.forEach(node => {
      executeNode(node.id, newRun.id);
    });
    
  }, [isRunning, currentWorkflow, nodes, connections, setIsRunning, setWorkflowRuns, toast]);
  
  const executeNode = useCallback((nodeId: string, runId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !currentWorkflow) return;
    
    // Update node status
    updateNodeStatus(nodeId, 'running');
    
    // Create node run
    const nodeRun = {
      nodeId,
      status: 'running' as 'idle' | 'running' | 'completed' | 'error',
      startTime: new Date().toISOString(),
      input: { /* Mock input data */ },
    };
    
    // Add node run to workflow run
    setWorkflowRuns((prev: WorkflowRun[]) => {
      const updatedRuns = [...prev];
      const runIndex = updatedRuns.findIndex(run => run.id === runId);
      if (runIndex !== -1) {
        updatedRuns[runIndex] = {
          ...updatedRuns[runIndex],
          nodeRuns: [...updatedRuns[runIndex].nodeRuns, nodeRun]
        };
      }
      return updatedRuns;
    });
    
    // Human approval node needs manual intervention
    if (node.type === 'human' && node.requiresApproval) {
      // This will stay in "running" status until approved or rejected
      return;
    }
    
    // Simulate node execution with timeout
    const executionTime = Math.floor(Math.random() * 2000) + 1000;
    
    setTimeout(() => {
      // 90% success rate
      const success = Math.random() > 0.1;
      
      if (success) {
        // Node completed successfully
        updateNodeStatus(nodeId, 'completed');
        
        // Update node run
        setWorkflowRuns((prev: WorkflowRun[]) => {
          const updatedRuns = [...prev];
          const runIndex = updatedRuns.findIndex(run => run.id === runId);
          if (runIndex !== -1) {
            const nodeRunIndex = updatedRuns[runIndex].nodeRuns.findIndex(nr => nr.nodeId === nodeId);
            if (nodeRunIndex !== -1) {
              updatedRuns[runIndex].nodeRuns[nodeRunIndex] = {
                ...updatedRuns[runIndex].nodeRuns[nodeRunIndex],
                status: 'completed',
                endTime: new Date().toISOString(),
                output: { result: "Success", data: { /* Mock output data */ } }
              };
            }
          }
          return updatedRuns;
        });
        
        // Find and execute next nodes
        const nextConnections = connections.filter(conn => conn.source === nodeId);
        if (nextConnections.length === 0) {
          // Check if all nodes are completed
          checkWorkflowCompletion(runId);
        } else {
          // Execute next nodes
          nextConnections.forEach(conn => {
            executeNode(conn.target, runId);
          });
        }
      } else {
        // Node failed
        updateNodeStatus(nodeId, 'error');
        
        // Update node run with error
        setWorkflowRuns((prev: WorkflowRun[]) => {
          const updatedRuns = [...prev];
          const runIndex = updatedRuns.findIndex(run => run.id === runId);
          if (runIndex !== -1) {
            const nodeRunIndex = updatedRuns[runIndex].nodeRuns.findIndex(nr => nr.nodeId === nodeId);
            if (nodeRunIndex !== -1) {
              updatedRuns[runIndex].nodeRuns[nodeRunIndex] = {
                ...updatedRuns[runIndex].nodeRuns[nodeRunIndex],
                status: 'error',
                endTime: new Date().toISOString(),
                error: "An error occurred during execution"
              };
            }
            
            // Also update the overall workflow run status
            updatedRuns[runIndex].status = 'error';
            updatedRuns[runIndex].endTime = new Date().toISOString();
          }
          return updatedRuns;
        });
        
        // Log workflow failure
        if (currentWorkflow) {
          logWorkflowActivity(currentWorkflow, 'failed');
        }
        
        // Show error toast
        toast({
          variant: "destructive",
          title: "Node Execution Failed",
          description: `Error in node: ${node.title}`,
        });
        
        // Stop workflow execution
        setIsRunning(false);
      }
    }, executionTime);
    
  }, [nodes, connections, updateNodeStatus, setWorkflowRuns, toast, setIsRunning, currentWorkflow, logWorkflowActivity]);
  
  const checkWorkflowCompletion = useCallback((runId: string) => {
    // Check if all nodes are in completed or error state
    let allCompleted = true;
    
    setWorkflowRuns((prev: WorkflowRun[]) => {
      const updatedRuns = [...prev];
      const runIndex = updatedRuns.findIndex(run => run.id === runId);
      
      if (runIndex !== -1) {
        const run = updatedRuns[runIndex];
        
        // Check nodes that should have been executed
        const executedNodeIds = new Set(run.nodeRuns.map(nr => nr.nodeId));
        const pendingNodes = nodes.filter(node => {
          // Skip human approval nodes that are waiting for approval
          if (node.type === 'human' && node.requiresApproval) {
            const nodeRun = run.nodeRuns.find(nr => nr.nodeId === node.id);
            return nodeRun && nodeRun.status === 'running';
          }
          
          return executedNodeIds.has(node.id) && 
            run.nodeRuns.find(nr => nr.nodeId === node.id)?.status === 'running';
        });
        
        if (pendingNodes.length === 0) {
          // All nodes are done, update workflow run status
          if (run.status !== 'error') {
            updatedRuns[runIndex] = {
              ...run,
              status: 'completed',
              endTime: new Date().toISOString(),
              executionTime: new Date().getTime() - new Date(run.startTime).getTime()
            };
            
            // Show success toast
            if (currentWorkflow) {
              toast({
                title: "Workflow Completed",
                description: `${currentWorkflow.title} executed successfully`,
              });
              
              // Log the workflow completion
              logWorkflowActivity(currentWorkflow, 'completed');
            }
          }
          
          // Reset running state
          setIsRunning(false);
        } else {
          allCompleted = false;
        }
      }
      
      return updatedRuns;
    });
    
    return allCompleted;
  }, [nodes, setWorkflowRuns, setIsRunning, toast, currentWorkflow, logWorkflowActivity]);

  return { runWorkflow };
};
