
import { Link } from "react-router-dom";
import { User, Bot, ChevronRight, BarChart3, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WorkflowNode } from "@/types/workflow";
import { useState, useEffect } from "react";

interface AgentNodeDetailsProps {
  node: WorkflowNode;
}

interface AgentData {
  name: string;
  owner: string;
  status: string;
  lastRun: string;
  useCase: string;
  tags: string[];
}

// Mock agent directory data - this would come from a global store or API
const mockAgentDirectory = {
  "1": {
    name: "Data Analyst Agent",
    owner: "Finance Team",
    status: "Active",
    lastRun: "10 minutes ago",
    useCase: "Finance",
    tags: ["data", "reporting"]
  },
  "2": {
    name: "Customer Support Bot",
    owner: "Support Team",
    status: "Inactive",
    lastRun: "2 days ago",
    useCase: "Customer Service",
    tags: ["support", "chat"]
  },
  "3": {
    name: "Marketing Analytics",
    owner: "Marketing Team",
    status: "Testing",
    lastRun: "1 hour ago",
    useCase: "Marketing",
    tags: ["analytics", "automation"]
  },
  "4": {
    name: "Inventory Manager",
    owner: "Operations Team",
    status: "Active",
    lastRun: "30 minutes ago",
    useCase: "Operations",
    tags: ["inventory", "logistics"]
  },
  "5": {
    name: "HR Document Processor",
    owner: "HR Team",
    status: "Active",
    lastRun: "5 hours ago",
    useCase: "HR",
    tags: ["document", "processing"]
  }
};

export function AgentNodeDetails({ node }: AgentNodeDetailsProps) {
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (node.type !== 'agent' || !node.agentId) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API fetch from agent directory
    setTimeout(() => {
      const agent = mockAgentDirectory[node.agentId as keyof typeof mockAgentDirectory];
      
      if (agent) {
        setAgentData(agent);
      } else {
        console.warn(`Agent with ID ${node.agentId} not found in directory`);
      }
      
      setIsLoading(false);
    }, 300);
  }, [node]);

  if (node.type !== 'agent' || !node.agentId) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold flex items-center">
              <Bot className="h-4 w-4 mr-2 text-primary" />
              {node.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">{node.description}</p>
          </div>
          <Badge className={
            node.status === 'completed' ? 'bg-green-100 text-green-800' : 
            node.status === 'error' ? 'bg-red-100 text-red-800' :
            node.status === 'running' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
          }>
            {node.status || 'Idle'}
          </Badge>
        </div>
        
        {isLoading ? (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Loading agent data...
          </div>
        ) : agentData ? (
          <>
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div>
                <div className="text-muted-foreground">Agent Name</div>
                <div className="font-medium">{agentData.name}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Owner</div>
                <div className="font-medium">{agentData.owner}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Use Case</div>
                <div className="font-medium">{agentData.useCase}</div>
              </div>
              {node.lastRunTimestamp && (
                <div>
                  <div className="text-muted-foreground">Last Run</div>
                  <div className="font-medium">{node.lastRunTimestamp}</div>
                </div>
              )}
              {node.executionTime && (
                <div>
                  <div className="text-muted-foreground">Execution Time</div>
                  <div className="font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {node.executionTime}ms
                  </div>
                </div>
              )}
              {node.successRate && (
                <div>
                  <div className="text-muted-foreground">Success Rate</div>
                  <div className="font-medium flex items-center">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    {node.successRate}%
                  </div>
                </div>
              )}
            </div>
            
            {agentData.tags && agentData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {agentData.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="p-4 border border-yellow-200 bg-yellow-50 text-yellow-700 text-sm rounded-md">
            Warning: Agent with ID {node.agentId} not found in directory. 
            Please verify the agent exists or create it in the Agent Directory.
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground flex items-center">
            <User className="h-3 w-3 mr-1" /> 
            Last modified by Admin
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/agent-directory?agentId=${node.agentId}`}>
              View Agent <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
