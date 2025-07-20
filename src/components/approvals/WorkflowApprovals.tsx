
import { useWorkflow } from "@/hooks/useWorkflow";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Edit, User, Calendar, Clock } from "lucide-react";
import { WorkflowNode } from "@/types/workflow";

interface WorkflowApprovalsProps {
  onViewWorkflow?: (workflowId: string, nodeId: string) => void;
}

export function WorkflowApprovals({ onViewWorkflow }: WorkflowApprovalsProps) {
  const { 
    nodes, 
    currentWorkflow,
    approveHumanTask, 
    rejectHumanTask 
  } = useWorkflow();
  
  // Find human approval nodes that need approval
  const pendingApprovals = nodes.filter(
    node => node.type === 'human' && node.requiresApproval && node.status === 'running'
  );
  
  if (pendingApprovals.length === 0) {
    return null;
  }
  
  const handleView = (node: WorkflowNode) => {
    if (onViewWorkflow && currentWorkflow) {
      onViewWorkflow(currentWorkflow.id, node.id);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Workflow Approvals</h3>
      
      {pendingApprovals.map(node => (
        <div 
          key={node.id} 
          className="p-4 border rounded-lg border-l-4 border-l-yellow-500"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">
                {node.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                {node.description || 'Workflow step requiring human approval'}
              </p>
              
              <div className="flex gap-4 text-sm text-muted-foreground">
                {node.approvalAssignee && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {node.approvalAssignee}
                  </div>
                )}
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Created {node.lastRunTimestamp || 'recently'}
                </div>
                
                {node.approvalDeadline && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Due {node.approvalDeadline}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleView(node)}
              className="gap-1"
            >
              <Edit className="h-4 w-4" />
              <span>Review Details</span>
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => rejectHumanTask(node.id)}
              className="gap-1"
            >
              <XCircle className="h-4 w-4" />
              <span>Reject</span>
            </Button>
            <Button 
              size="sm"
              onClick={() => approveHumanTask(node.id)}
              className="gap-1"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Approve</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
