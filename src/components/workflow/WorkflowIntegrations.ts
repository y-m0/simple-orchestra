
// This file holds integration points between workflows and other system components

// Function to register a new workflow with the system
export const registerWorkflow = (workflowId: string, workflowName: string) => {
  // Log the registration
  console.log(`Activity Log: New workflow "${workflowName}" (${workflowId}) registered at ${new Date().toLocaleTimeString()}`);
  
  // In a real app, we would:
  // 1. Add to global state or API
  // 2. Update org-wide workflow list
  // 3. Expose via API endpoint
};

// Function to create a workflow approval request
export const createApprovalRequest = (
  workflowId: string, 
  nodeId: string, 
  title: string, 
  assignee: string
) => {
  // Log the approval request
  console.log(`Activity Log: Approval requested for workflow "${workflowId}" node "${nodeId}" at ${new Date().toLocaleTimeString()}`);
  
  // In a real app, we would:
  // 1. Add to approvals queue
  // 2. Notify the assignee
  // 3. Update UI to show pending approval
  
  return {
    id: `approval-${Date.now()}`,
    workflowId,
    nodeId,
    title,
    assignee,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
};

// Function to log workflow activity to the central activity log
export const logWorkflowActivity = (
  workflowId: string,
  action: 'created' | 'updated' | 'deleted' | 'run' | 'completed' | 'failed',
  user: string = 'Current User',
  details?: Record<string, any>
) => {
  const timestamp = new Date().toISOString();
  
  // Format the log message
  const actionVerb = 
    action === 'created' ? 'created' : 
    action === 'updated' ? 'updated' :
    action === 'deleted' ? 'deleted' :
    action === 'run' ? 'started' :
    action === 'completed' ? 'completed successfully' :
    'failed';
  
  const logEntry = {
    timestamp,
    workflowId,
    user,
    action,
    message: `Workflow ${workflowId} was ${actionVerb} by ${user}`,
    details
  };
  
  // Log to console for now
  console.log(`Activity Log: ${logEntry.message} at ${new Date(timestamp).toLocaleTimeString()}`);
  
  // In a real app, we would:
  // 1. Store in a central activity log
  // 2. Update UI components that show activity
  // 3. Potentially trigger notifications
  
  return logEntry;
};

// Function to apply organization settings to a workflow
export const applyWorkflowSettings = (workflowId: string) => {
  // Get workflow defaults from global state
  const workflowDefaults = (window as any).workflowDefaults;
  
  // If settings exist, apply them
  if (workflowDefaults) {
    console.log(`Applied organization settings to workflow ${workflowId}:`, workflowDefaults);
    return workflowDefaults;
  }
  
  // Default fallback settings
  const fallbackSettings = {
    autoApprove: false,
    errorRetries: 1,
    loggingLevel: "info",
    concurrentRuns: 3,
    defaultTimeout: 60,
    notifyAdmin: true
  };
  
  console.warn(`No workflow settings found, using fallback defaults for workflow ${workflowId}`);
  return fallbackSettings;
};

// Function to update dashboard metrics when workflow events occur
export const updateDashboardMetrics = (workflowId: string, event: 'run' | 'complete' | 'error') => {
  // This would update metrics shown in the dashboard
  console.log(`Dashboard metrics updated for workflow ${workflowId}, event: ${event}`);
  
  // In a real app, we would:
  // 1. Increment workflow run counts
  // 2. Update success/failure rates
  // 3. Update last run timestamps
  // 4. Trigger UI updates for dashboard components
};
