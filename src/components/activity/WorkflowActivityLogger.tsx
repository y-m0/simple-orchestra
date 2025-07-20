
import { useState, useEffect } from "react";
import { useWorkflow } from "@/hooks/useWorkflow";

interface WorkflowActivityLoggerProps {
  onLogActivity?: (logEntry: string) => void;
}

export function WorkflowActivityLogger({ onLogActivity }: WorkflowActivityLoggerProps) {
  const { workflowRuns, currentWorkflow } = useWorkflow();
  const [previousRunsCount, setPreviousRunsCount] = useState<number>(0);
  const [previousRunStatuses, setPreviousRunStatuses] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // If there's a new run, log it
    if (workflowRuns.length > previousRunsCount && currentWorkflow) {
      const latestRun = workflowRuns[workflowRuns.length - 1];
      
      // Format timestamp
      const timestamp = new Date().toLocaleTimeString();
      
      // Create log message
      const logMessage = `[${timestamp}] • Workflow ${currentWorkflow.title} run by ${latestRun.triggeredBy} with ${latestRun.nodeRuns.length} steps → Status: ${latestRun.status === 'completed' ? 'Success' : latestRun.status === 'error' ? 'Failed' : 'Running'}`;
      
      // Send to parent component or activity log system
      if (onLogActivity) {
        onLogActivity(logMessage);
      }
      
      // Log to console for activity log integration
      console.log(`Activity Log: Workflow ${currentWorkflow.id} ${latestRun.status} at ${timestamp}`);
      
      setPreviousRunsCount(workflowRuns.length);
    }
    
    // Check for status changes in existing runs
    const newRunStatuses: Record<string, string> = {};
    
    workflowRuns.forEach(run => {
      newRunStatuses[run.id] = run.status;
      
      // If status changed, log it
      if (previousRunStatuses[run.id] && previousRunStatuses[run.id] !== run.status) {
        const timestamp = new Date().toLocaleTimeString();
        const statusText = run.status === 'completed' ? 'completed successfully' : 
                           run.status === 'error' ? 'failed' : 'is running';
        
        const logMessage = `[${timestamp}] • Workflow ${run.workflowId} ${statusText}`;
        
        if (onLogActivity) {
          onLogActivity(logMessage);
        }
        
        // Log to console for activity log integration
        console.log(`Activity Log: Workflow ${run.workflowId} ${statusText} at ${timestamp}`);
      }
    });
    
    setPreviousRunStatuses(newRunStatuses);
  }, [workflowRuns, previousRunsCount, previousRunStatuses, currentWorkflow, onLogActivity]);
  
  // Also log workflow creation and modifications
  useEffect(() => {
    if (currentWorkflow) {
      // Create a simple event listener for workflow-related actions
      const handleStorageEvent = (event: StorageEvent) => {
        if (event.key?.startsWith('workflow_')) {
          const action = event.key.split('_')[1];
          const workflowId = event.key.split('_')[2];
          
          if (action && workflowId) {
            const timestamp = new Date().toLocaleTimeString();
            let actionText = '';
            
            switch (action) {
              case 'created':
                actionText = 'was created';
                break;
              case 'updated':
                actionText = 'was updated';
                break;
              case 'deleted':
                actionText = 'was deleted';
                break;
              default:
                return;
            }
            
            const logMessage = `[${timestamp}] • Workflow ${workflowId} ${actionText}`;
            
            if (onLogActivity) {
              onLogActivity(logMessage);
            }
            
            // Log to console for activity log integration
            console.log(`Activity Log: Workflow ${workflowId} ${actionText} at ${timestamp}`);
          }
        }
      };
      
      window.addEventListener('storage', handleStorageEvent);
      
      return () => {
        window.removeEventListener('storage', handleStorageEvent);
      };
    }
  }, [currentWorkflow, onLogActivity]);
  
  // This is a "silent" component that doesn't render anything visible
  return null;
}
