
export interface WorkflowNode {
  id: string;
  type: 'agent' | 'logic' | 'io' | 'human';
  title: string;
  position: { x: number; y: number };
  description?: string;
  status?: 'idle' | 'running' | 'completed' | 'error';
  tags?: string[];
  agentId?: string;
  requiresApproval?: boolean;
  approvalAssignee?: string;
  approvalDeadline?: string;
  lastRunTimestamp?: string;
  executionTime?: number;
  successRate?: number;
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  trigger: string;
  complexity: 'low' | 'medium' | 'high';
  status?: 'idle' | 'running' | 'completed' | 'error';
  successRate?: number;
  avgRunTime?: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  createdBy?: string;
  updatedAt?: string;
  lastModifiedBy?: string;
  lastRunAt?: string;
  totalRuns?: number;
  isTemplate?: boolean;
  orgId?: string;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'error';
  startTime: string;
  endTime?: string;
  executionTime?: number;
  triggeredBy: string;
  nodeRuns: {
    nodeId: string;
    status: 'idle' | 'running' | 'completed' | 'error';
    startTime: string;
    endTime?: string;
    input?: any;
    output?: any;
    error?: string;
  }[];
}
