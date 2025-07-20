
import { XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Approval {
  id: string;
  workflowName: string;
  requester: string;
  submittedAt: string; // ISO string
  status: "pending" | "approved" | "rejected";
  stakeholder?: string;
}

interface Props {
  approvals: Approval[];
  onView: (approvalId: string) => void;
}

export function PendingApprovalsFeed({ approvals, onView }: Props) {
  return (
    <div className="rounded-lg border bg-white dark:bg-card p-4">
      <h3 className="font-semibold text-lg mb-2 flex items-center">
        <Clock className="h-4 w-4 mr-2 text-yellow-500" />
        Pending Approvals
      </h3>
      {approvals.length === 0 && (
        <div className="text-muted-foreground text-sm text-center py-4">
          No pending approvals
        </div>
      )}
      <ul className="divide-y">
        {approvals.map((approval) => (
          <li key={approval.id} className="py-3 flex items-center justify-between cursor-pointer hover:bg-accent/20 rounded transition"
              onClick={() => onView(approval.id)}>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{approval.workflowName}</span>
                {approval.status === "pending" && (
                  <Badge variant="outline" className="text-yellow-700 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200">
                    Pending
                  </Badge>
                )}
                {approval.status === "approved" && (
                  <Badge variant="outline" className="text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300">
                    Approved
                  </Badge>
                )}
                {approval.status === "rejected" && (
                  <Badge variant="outline" className="text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300">
                    Rejected
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {approval.stakeholder 
                  ? `Approver: ${approval.stakeholder}` 
                  : `Requested by: ${approval.requester}`}
              </div>
            </div>
            <span className="text-xs flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              {new Date(approval.submittedAt).toLocaleDateString()} {new Date(approval.submittedAt).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
