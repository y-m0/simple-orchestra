
import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Workflow } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLocation, useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useWorkflow } from "@/hooks/useWorkflow";

// Enhanced with workflow linkage info
const mockAgents = [
  {
    id: "1",
    name: "Data Analyst Agent",
    owner: "Finance Team",
    status: "Active",
    lastRun: "10 minutes ago",
    useCase: "Finance",
    tags: ["data", "reporting"],
    linkedWorkflows: ["workflow-1", "workflow-3"]
  },
  {
    id: "2",
    name: "Customer Support Bot",
    owner: "Support Team",
    status: "Inactive",
    lastRun: "2 days ago",
    useCase: "Customer Service",
    tags: ["support", "chat"],
    linkedWorkflows: ["workflow-2"]
  },
  {
    id: "3",
    name: "Marketing Analytics",
    owner: "Marketing Team",
    status: "Testing",
    lastRun: "1 hour ago",
    useCase: "Marketing",
    tags: ["analytics", "automation"],
    linkedWorkflows: ["workflow-3", "workflow-5"]
  },
  {
    id: "4",
    name: "Inventory Manager",
    owner: "Operations Team",
    status: "Active",
    lastRun: "30 minutes ago",
    useCase: "Operations",
    tags: ["inventory", "logistics"],
    linkedWorkflows: ["workflow-4"]
  },
  {
    id: "5",
    name: "HR Document Processor",
    owner: "HR Team",
    status: "Active",
    lastRun: "5 hours ago",
    useCase: "HR",
    tags: ["document", "processing"],
    linkedWorkflows: ["workflow-5"]
  }
];

// Mock workflow titles
const workflowTitles: Record<string, string> = {
  'workflow-1': 'Customer Onboarding',
  'workflow-2': 'Expense Approval',
  'workflow-3': 'Data Analysis',
  'workflow-4': 'Report Generation',
  'workflow-5': 'Content Review',
};

export default function AgentDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedAgentId, setHighlightedAgentId] = useState<string | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentWorkflow } = useWorkflow();
  
  // Get agentId from query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const agentId = params.get('agentId');
    if (agentId) {
      setHighlightedAgentId(agentId);
      setExpandedAgent(agentId);
      
      // Scroll to the agent row
      setTimeout(() => {
        const agentRow = document.getElementById(`agent-row-${agentId}`);
        if (agentRow) {
          agentRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
          agentRow.classList.add('bg-primary/5');
          setTimeout(() => {
            agentRow.classList.remove('bg-primary/5');
          }, 2000);
        }
      }, 100);
    }
  }, [location]);
  
  // Filter agents based on search query
  const filteredAgents = mockAgents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    agent.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigate to workflow details
  const navigateToWorkflow = (workflowId: string) => {
    navigate(`/workflows?id=${workflowId}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Agent Directory</h1>
        <Button>+ New Agent</Button>
      </div>
      
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem>Status: Active</DropdownMenuItem>
            <DropdownMenuItem>Status: Inactive</DropdownMenuItem>
            <DropdownMenuItem>Status: Testing</DropdownMenuItem>
            <DropdownMenuItem>Use Case: Finance</DropdownMenuItem>
            <DropdownMenuItem>Use Case: HR</DropdownMenuItem>
            <DropdownMenuItem>Use Case: Marketing</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Agents ({filteredAgents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent Name</TableHead>
                <TableHead>Owner / Team</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Task Run</TableHead>
                <TableHead>Use Case</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <>
                  <TableRow 
                    key={agent.id}
                    id={`agent-row-${agent.id}`}
                    className={`cursor-pointer ${
                      agent.id === highlightedAgentId 
                      ? "transition-colors duration-1000" 
                      : ""
                    }`}
                    onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                  >
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.owner}</TableCell>
                    <TableCell>
                      <Badge variant={
                        agent.status === "Active" ? "default" : 
                        agent.status === "Testing" ? "outline" : "secondary"
                      }>
                        {agent.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{agent.lastRun}</TableCell>
                    <TableCell>{agent.useCase}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Pause Agent</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Retire Agent</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  {expandedAgent === agent.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <div className="bg-gray-50 p-4">
                          <h3 className="text-sm font-medium mb-2 flex items-center">
                            <Workflow className="h-4 w-4 mr-2" /> 
                            Associated Workflows ({agent.linkedWorkflows?.length || 0})
                          </h3>
                          {agent.linkedWorkflows && agent.linkedWorkflows.length > 0 ? (
                            <div className="space-y-2">
                              {agent.linkedWorkflows.map(workflowId => (
                                <div 
                                  key={workflowId} 
                                  className="border p-2 rounded-md hover:bg-white cursor-pointer flex justify-between items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigateToWorkflow(workflowId);
                                  }}
                                >
                                  <span>{workflowTitles[workflowId] || `Workflow ${workflowId}`}</span>
                                  <Badge variant="outline">
                                    {workflowId === currentWorkflow?.id ? 'Active' : 'View'}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No associated workflows</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
