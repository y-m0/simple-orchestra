
import { useState } from 'react';
import { WorkflowNode, WorkflowConnection, Workflow, WorkflowRun } from '@/types/workflow';

export const useWorkflowState = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  return {
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
  };
};
