
import { useCallback } from 'react';
import { useStore } from '@/lib/store';
import { toast } from '@/components/ui/use-toast';
import type { Activity } from '@/lib/store';

interface UseWorkflowControlProps {
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  updateNodeStatus: (nodeId: string, status: string) => void;
  setWorkflowRuns: (runs: any[]) => void;
}

export const useWorkflowControl = ({
  isRunning,
  setIsRunning,
  updateNodeStatus,
  setWorkflowRuns,
}: UseWorkflowControlProps) => {
  const { setActivities } = useStore();

  const stopWorkflow = useCallback(() => {
    setIsRunning(false);
    // Update all nodes to stopped status
    updateNodeStatus('*', 'stopped');
    
    // Add to activity log
    setActivities((prev: Activity[]) => [...prev, {
      id: Date.now().toString(),
      type: 'workflow_stopped',
      status: 'error',
      workflowId: 'current',
      timestamp: new Date().toISOString(),
      details: 'Workflow was manually stopped'
    }]);

    toast({
      title: 'Workflow Stopped',
      description: 'The workflow has been stopped successfully',
    });
  }, [setIsRunning, updateNodeStatus, setActivities]);

  const pauseWorkflow = useCallback(() => {
    setIsRunning(false);
    // Update all nodes to paused status
    updateNodeStatus('*', 'paused');
    
    // Add to activity log
    setActivities((prev: Activity[]) => [...prev, {
      id: Date.now().toString(),
      type: 'workflow',
      status: 'pending',
      workflowId: 'current',
      timestamp: new Date().toISOString(),
      details: 'Workflow was paused'
    }]);

    toast({
      title: 'Workflow Paused',
      description: 'The workflow has been paused',
    });
  }, [setIsRunning, updateNodeStatus, setActivities]);

  const resumeWorkflow = useCallback(() => {
    setIsRunning(true);
    // Update all nodes to running status
    updateNodeStatus('*', 'running');
    
    // Add to activity log
    setActivities((prev: Activity[]) => [...prev, {
      id: Date.now().toString(),
      type: 'workflow',
      status: 'running',
      workflowId: 'current',
      timestamp: new Date().toISOString(),
      details: 'Workflow was resumed'
    }]);

    toast({
      title: 'Workflow Resumed',
      description: 'The workflow has been resumed',
    });
  }, [setIsRunning, updateNodeStatus, setActivities]);

  const approveHumanTask = useCallback((taskId: string) => {
    // Update the specific task node to approved status
    updateNodeStatus(taskId, 'approved');
    
    // Add to activity log
    setActivities((prev: Activity[]) => [...prev, {
      id: Date.now().toString(),
      type: 'task_approved',
      status: 'success',
      workflowId: 'current',
      timestamp: new Date().toISOString(),
      details: `Task ${taskId} was approved`
    }]);

    toast({
      title: 'Task Approved',
      description: 'The task has been approved successfully',
    });
  }, [updateNodeStatus, setActivities]);

  const rejectHumanTask = useCallback((taskId: string) => {
    // Update the specific task node to rejected status
    updateNodeStatus(taskId, 'rejected');
    
    // Add to activity log
    setActivities((prev: Activity[]) => [...prev, {
      id: Date.now().toString(),
      type: 'task_rejected',
      status: 'error',
      workflowId: 'current',
      timestamp: new Date().toISOString(),
      details: `Task ${taskId} was rejected`
    }]);

    toast({
      title: 'Task Rejected',
      description: 'The task has been rejected',
    });
  }, [updateNodeStatus, setActivities]);

  return {
    stopWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    approveHumanTask,
    rejectHumanTask,
  };
};
