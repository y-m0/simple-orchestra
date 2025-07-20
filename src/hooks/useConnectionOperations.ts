
import { WorkflowConnection } from '@/types/workflow';

export const useConnectionOperations = (
  setConnections: (connections: WorkflowConnection[] | ((prev: WorkflowConnection[]) => WorkflowConnection[])) => void
) => {
  const connectNodes = (sourceId: string, targetId: string, label?: string, condition?: string) => {
    const connectionId = `connection-${Date.now()}`;
    setConnections((prev: WorkflowConnection[]) => [...prev, {
      id: connectionId,
      source: sourceId,
      target: targetId,
      label,
      condition
    }]);
  };

  return {
    connectNodes,
  };
};
