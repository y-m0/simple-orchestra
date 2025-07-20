
import { WorkflowNode } from '@/types/workflow';

export const useNodeOperations = (
  nodes: WorkflowNode[],
  setNodes: (nodes: WorkflowNode[] | ((prev: WorkflowNode[]) => WorkflowNode[])) => void
) => {
  const addNode = (node: Omit<WorkflowNode, 'id' | 'position'>) => {
    const newNode: WorkflowNode = {
      ...node,
      id: `node-${Date.now()}`,
      position: { x: 200, y: 200 },
    };
    setNodes((prev: WorkflowNode[]) => [...prev, newNode]);
  };

  const moveNode = (id: string, position: { x: number; y: number }) => {
    setNodes((prev: WorkflowNode[]) => prev.map(node => 
      node.id === id ? { ...node, position } : node
    ));
  };

  const updateNodeStatus = (id: string, status: WorkflowNode['status']) => {
    setNodes((prev: WorkflowNode[]) => prev.map(node => 
      node.id === id ? { ...node, status } : node
    ));
  };

  return {
    addNode,
    moveNode,
    updateNodeStatus,
  };
};
