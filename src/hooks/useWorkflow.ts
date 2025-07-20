import { useCallback } from 'react';
import { predefinedWorkflows } from '@/data/workflows';
import { useWorkflowState } from './useWorkflowState';
import { useNodeOperations } from './useNodeOperations';
import { useConnectionOperations } from './useConnectionOperations';
import { useWorkflowExecution } from './useWorkflowExecution';
import { useWorkflowControl } from './useWorkflowControl';
import { 
  registerWorkflow, 
  logWorkflowActivity,
  updateDashboardMetrics 
} from '@/components/workflow/WorkflowIntegrations';
import { useStore } from '@/lib/store';
import { usePineconeWorkflow } from './usePineconeWorkflow';
import type { Activity } from '@/lib/store';

export const useWorkflow = () => {
  const {
    nodes,
    setNodes,
    connections,
    setConnections,
    currentWorkflow,
    setCurrentWorkflow,
    workflowRuns,
    setWorkflowRuns,
    isRunning,
    setIsRunning,
  } = useWorkflowState();

  const { addActivity } = useStore();
  const { addNode, moveNode, updateNodeStatus } = useNodeOperations(nodes, setNodes);
  const { connectNodes } = useConnectionOperations(setConnections);
  const { runWorkflow } = useWorkflowExecution(
    nodes,
    connections,
    currentWorkflow,
    isRunning,
    setIsRunning,
    updateNodeStatus,
    setWorkflowRuns,
  );
  const { stopWorkflow, approveHumanTask, rejectHumanTask } = useWorkflowControl({
    isRunning,
    setIsRunning,
    updateNodeStatus,
    setWorkflowRuns,
  });
  
  const { 
    indexWorkflow, 
    findSimilarWorkflows, 
    deleteWorkflowFromIndex 
  } = usePineconeWorkflow();

  const loadWorkflow = useCallback((workflowId: string) => {
    const workflow = predefinedWorkflows.find(wf => wf.id === workflowId);
    if (workflow) {
      setNodes(workflow.nodes);
      setConnections(workflow.connections);
      setCurrentWorkflow(workflow);
      
      // Log workflow loading in activity log
      logWorkflowActivity(workflowId, 'updated');
      
      // Add to global activity store
      addActivity({
        type: 'workflow',
        details: `Workflow ${workflow.title} (${workflowId}) loaded`,
        workflowId,
        status: 'success',
        workflowName: workflow.title
      });
    }
  }, [setNodes, setConnections, setCurrentWorkflow, addActivity]);
  
  const createWorkflow = useCallback((workflow: any) => {
    // Register the new workflow with correct args
    registerWorkflow(workflow.id, workflow.title);
    
    // Set as current workflow
    setCurrentWorkflow(workflow);
    setNodes(workflow.nodes || []);
    setConnections(workflow.connections || []);
    
    // Log creation in activity log
    logWorkflowActivity(workflow.id, 'created');
    
    // Update dashboard metrics with appropriate event
    updateDashboardMetrics(workflow.id, 'run');
    
    // Add to global activity store
    addActivity({
      type: 'workflow',
      details: `New workflow "${workflow.title}" (${workflow.id}) created`,
      workflowId: workflow.id,
      status: 'success',
      workflowName: workflow.title
    });
    
    // Index workflow in Pinecone for vector search
    indexWorkflow(workflow).catch(error => 
      console.error(`Failed to index workflow in Pinecone: ${error}`)
    );
    
    return workflow;
  }, [setCurrentWorkflow, setNodes, setConnections, addActivity, indexWorkflow]);
  
  const runWorkflowWithLogging = useCallback(() => {
    const result = runWorkflow();
    
    if (currentWorkflow) {
      // Add to global activity store
      addActivity({
        type: 'workflow',
        details: `Workflow "${currentWorkflow.title}" (${currentWorkflow.id}) started execution`,
        workflowId: currentWorkflow.id,
        status: 'pending',
        workflowName: currentWorkflow.title
      });
    }
    
    return result;
  }, [runWorkflow, currentWorkflow, addActivity]);
  
  const stopWorkflowWithLogging = useCallback(() => {
    stopWorkflow();
    
    if (currentWorkflow) {
      // Add to global activity store
      addActivity({
        type: 'workflow',
        details: `Workflow "${currentWorkflow.title}" (${currentWorkflow.id}) manually stopped`,
        workflowId: currentWorkflow.id,
        status: 'error',
        workflowName: currentWorkflow.title
      });
    }
  }, [stopWorkflow, currentWorkflow, addActivity]);
  
  const approveHumanTaskWithLogging = useCallback((nodeId: string) => {
    approveHumanTask(nodeId);
    
    if (currentWorkflow) {
      const node = nodes.find(n => n.id === nodeId);
      
      // Add to global activity store
      addActivity({
        type: 'workflow',
        details: `Human task "${node?.title || nodeId}" in workflow ${currentWorkflow.id} approved`,
        workflowId: currentWorkflow.id,
        status: 'success',
        workflowName: currentWorkflow.title
      });
    }
  }, [approveHumanTask, currentWorkflow, nodes, addActivity]);
  
  const rejectHumanTaskWithLogging = useCallback((nodeId: string) => {
    rejectHumanTask(nodeId);
    
    if (currentWorkflow) {
      const node = nodes.find(n => n.id === nodeId);
      
      // Add to global activity store
      addActivity({
        type: 'workflow',
        details: `Human task "${node?.title || nodeId}" in workflow ${currentWorkflow.id} rejected`,
        workflowId: currentWorkflow.id,
        status: 'error',
        workflowName: currentWorkflow.title
      });
    }
  }, [rejectHumanTask, currentWorkflow, nodes, addActivity]);

  return {
    nodes,
    connections,
    currentWorkflow,
    workflowRuns,
    isRunning,
    addNode,
    moveNode,
    connectNodes,
    updateNodeStatus,
    loadWorkflow,
    createWorkflow,
    runWorkflow: runWorkflowWithLogging,
    stopWorkflow: stopWorkflowWithLogging,
    approveHumanTask: approveHumanTaskWithLogging,
    rejectHumanTask: rejectHumanTaskWithLogging,
    findSimilarWorkflows,
    deleteWorkflowFromIndex,
  };
};
