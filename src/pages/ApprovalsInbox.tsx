
import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Edit, UserCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowApprovals } from "@/components/approvals/WorkflowApprovals";
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from "@/hooks/useWorkflow";

const mockApprovals = [
  {
    id: "1",
    agentName: "Financial Analyst Agent",
    action: "Approve monthly budget allocation",
    context: "Based on current department spending and projected needs, I recommend allocating $25,000 to Marketing, $15,000 to R&D, and $10,000 to Operations for the next month.",
    createdAt: "2 hours ago",
    priority: "high"
  },
  {
    id: "2",
    agentName: "Customer Support Agent",
    action: "Issue refund to customer #45123",
    context: "Customer purchased Premium plan but was unable to access features due to technical issues on our end. Service was down for 3 days. Recommending full refund of $129.99.",
    createdAt: "5 hours ago",
    priority: "medium"
  },
  {
    id: "3",
    agentName: "HR Processing Agent",
    action: "Approve extended leave request",
    context: "Employee John Doe (ID: 3421) has requested extended medical leave with documentation from certified physician. All paperwork is complete and meets policy requirements.",
    createdAt: "1 day ago",
    priority: "low"
  },
  {
    id: "4",
    agentName: "Inventory Manager Agent",
    action: "Purchase additional server equipment",
    context: "Server utilization is at 87% and projected to reach capacity within 30 days. Recommend ordering 3 additional servers at $4,200 each to ensure continuity of operations.",
    createdAt: "2 days ago",
    priority: "medium"
  },
];

export default function ApprovalsInbox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("cards");
  const navigate = useNavigate();
  const { workflowRuns, nodes, approveHumanTask, rejectHumanTask } = useWorkflow();
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  
  // Find workflow nodes that require approval
  useEffect(() => {
    // Look for human nodes that require approval in current workflow runs
    const pendingNodes = nodes.filter(node => 
      node.type === 'human' && 
      node.requiresApproval && 
      node.status === 'running'
    );
    
    if (pendingNodes.length > 0) {
      const approvals = pendingNodes.map(node => ({
        id: `approval-${node.id}`,
        nodeId: node.id,
        title: node.title || 'Human Approval Required',
        description: node.description || 'This step requires manual approval to proceed',
        context: `Workflow step "${node.title}" requires your approval to continue execution.`,
        createdAt: node.lastRunTimestamp || new Date().toISOString(),
        assignee: node.approvalAssignee || 'Current User',
        priority: 'high',
        workflowId: workflowRuns.length > 0 ? workflowRuns[workflowRuns.length - 1].workflowId : undefined
      }));
      
      setPendingApprovals(approvals);
    } else {
      setPendingApprovals([]);
    }
  }, [nodes, workflowRuns]);
  
  // Filter approvals based on search query
  const filteredApprovals = [...pendingApprovals, ...mockApprovals].filter(approval => 
    (approval.agentName || approval.title).toLowerCase().includes(searchQuery.toLowerCase()) || 
    approval.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    approval.context?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const navigateToWorkflow = (workflowId?: string, nodeId?: string) => {
    if (workflowId) {
      navigate(`/workflows?id=${workflowId}${nodeId ? `&node=${nodeId}` : ''}`);
    }
  };

  // Handle approval actions
  const handleApprove = (approval: any) => {
    // If it's a workflow approval
    if (approval.nodeId) {
      approveHumanTask(approval.nodeId);
      
      // Remove from local approvals list
      setPendingApprovals(prev => prev.filter(a => a.id !== approval.id));
      
      // Log the activity
      console.log(`Activity Log: Approval ${approval.id} granted for workflow step at ${new Date().toLocaleTimeString()}`);
    }
  };
  
  const handleReject = (approval: any) => {
    // If it's a workflow approval
    if (approval.nodeId) {
      rejectHumanTask(approval.nodeId);
      
      // Remove from local approvals list
      setPendingApprovals(prev => prev.filter(a => a.id !== approval.id));
      
      // Log the activity
      console.log(`Activity Log: Approval ${approval.id} rejected for workflow step at ${new Date().toLocaleTimeString()}`);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Approvals Inbox</h1>
      
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search approvals..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs value={view} onValueChange={setView} className="w-[180px]">
          <TabsList className="w-full">
            <TabsTrigger value="cards" className="flex-1">Cards</TabsTrigger>
            <TabsTrigger value="list" className="flex-1">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Workflow approvals section */}
      <WorkflowApprovals onViewWorkflow={navigateToWorkflow} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workflow-generated approvals */}
        {pendingApprovals.map((approval) => (
          <Card key={approval.id} className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{approval.title}</CardTitle>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <UserCircle className="h-4 w-4 mr-1" />
                <span>{approval.assignee}</span>
                <span className="mx-2">•</span>
                <span>{typeof approval.createdAt === 'string' ? 
                  new Date(approval.createdAt).toLocaleString() : 'Just now'}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{approval.context}</p>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-blue-500 gap-1"
                  onClick={() => navigateToWorkflow(approval.workflowId, approval.nodeId)}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>View Workflow</span>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 justify-end pt-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-4 w-4" />
                <span>Request Changes</span>
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="gap-1"
                onClick={() => handleReject(approval)}
              >
                <XCircle className="h-4 w-4" />
                <span>Reject</span>
              </Button>
              <Button 
                size="sm" 
                className="gap-1"
                onClick={() => handleApprove(approval)}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approve</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {/* Mock approvals */}
        {filteredApprovals.length > pendingApprovals.length && mockApprovals.map((approval) => (
          <Card key={approval.id} className={`
            ${approval.priority === "high" ? "border-l-4 border-l-red-500" : 
              approval.priority === "medium" ? "border-l-4 border-l-yellow-500" : 
              "border-l-4 border-l-blue-500"}
          `}>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <CardTitle className="text-lg">{approval.action}</CardTitle>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <UserCircle className="h-4 w-4 mr-1" />
                <span>{approval.agentName}</span>
                <span className="mx-2">•</span>
                <span>{approval.createdAt}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{approval.context}</p>
            </CardContent>
            <CardFooter className="flex gap-2 justify-end pt-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Edit className="h-4 w-4" />
                <span>Request Changes</span>
              </Button>
              <Button variant="destructive" size="sm" className="gap-1">
                <XCircle className="h-4 w-4" />
                <span>Reject</span>
              </Button>
              <Button size="sm" className="gap-1">
                <CheckCircle className="h-4 w-4" />
                <span>Approve</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {filteredApprovals.length === 0 && !searchQuery && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No pending approvals</h3>
          <p className="text-muted-foreground">You're all caught up! Check back later for new items.</p>
        </div>
      )}
      
      {filteredApprovals.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No matching approvals</h3>
          <p className="text-muted-foreground">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}
