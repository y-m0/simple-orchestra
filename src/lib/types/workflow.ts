export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'archived';
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
  metadata?: {
    projectId?: string;
    goalId?: string;
    tags?: string[];
    [key: string]: any;
  };
}

export interface WorkflowStep {
  id: string;
  type: 'agent' | 'tool' | 'condition' | 'parallel';
  config: {
    agentId?: string;
    toolId?: string;
    condition?: string;
    parallelSteps?: WorkflowStep[];
    [key: string]: any;
  };
  nextStepId?: string;
  metadata?: {
    [key: string]: any;
  };
} 