
interface WorkflowDefaults {
  autoApprove: boolean;
  errorRetries: number;
  loggingLevel: string;
  concurrentRuns: number;
  defaultTimeout: number;
  notifyAdmin: boolean;
}

interface Window {
  workflowDefaults?: WorkflowDefaults;
}
