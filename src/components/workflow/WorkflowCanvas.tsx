
import { useState, useRef, useEffect } from "react";
import { useWorkflow } from "@/hooks/useWorkflow";
import { WorkflowNode as IWorkflowNode } from "@/types/workflow";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  GitBranch, 
  User, 
  Database, 
  FileCheck, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Percent,
  ChevronRight
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AgentNodeDetails } from "./AgentNodeDetails";
import { Button } from "@/components/ui/button";

interface WorkflowCanvasProps {
  workflowId?: string;
}

export function WorkflowCanvas({ workflowId }: WorkflowCanvasProps) {
  const { nodes, connections, moveNode, loadWorkflow, isRunning } = useWorkflow();
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  useEffect(() => {
    if (workflowId) {
      loadWorkflow(workflowId);
      
      // Log that the workflow was viewed for activity tracking
      console.log(`Activity Log: Workflow ${workflowId} viewed at ${new Date().toLocaleTimeString()}`);
    }
  }, [workflowId, loadWorkflow]);

  // Check if settings have been loaded
  useEffect(() => {
    // Access workflow defaults if set by the WorkflowSettings component
    const workflowDefaults = (window as any).workflowDefaults;
    
    if (workflowDefaults) {
      console.log("Applying workflow defaults:", workflowDefaults);
      
      // Apply any relevant defaults to the workflow canvas
      // This would typically affect things like node timeouts, logging level, etc.
    } else {
      // Log warning about missing defaults
      console.warn("Workflow defaults not found, using system defaults");
    }
  }, []);

  const handleDragStart = (e: React.DragEvent, nodeId: string) => {
    setDraggingNodeId(nodeId);
    e.dataTransfer.setData('text/plain', nodeId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current || !draggingNodeId) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    moveNode(draggingNodeId, { x, y });
  };

  const handleDragEnd = () => {
    setDraggingNodeId(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingNodeId(null);
  };

  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setSelectedNodeId(nodeId);
    
    // Log node inspection for activity tracking
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      console.log(`Activity Log: Node "${node.title}" inspected at ${new Date().toLocaleTimeString()}`);
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'agent':
        return <Bot className="h-4 w-4" />;
      case 'logic':
        return <GitBranch className="h-4 w-4" />;
      case 'human':
        return <User className="h-4 w-4" />;
      case 'io':
        return <Database className="h-4 w-4" />;
      default:
        return <FileCheck className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'running':
        return (
          <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div 
        ref={canvasRef}
        className="flex-1 bg-muted/10 relative overflow-auto min-h-[500px] border rounded-md"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {nodes.map((node) => (
          <Popover key={node.id}>
            <PopoverTrigger asChild>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, node.id)}
                onDragEnd={handleDragEnd}
                onClick={(e) => handleNodeClick(e, node.id)}
                className={cn(
                  "absolute p-3 rounded-lg border shadow-md cursor-move bg-background",
                  node.type === 'agent' ? 'border-primary/50' : 
                  node.type === 'logic' ? 'border-blue-500/50' : 
                  node.type === 'human' ? 'border-orange-500/50' :
                  'border-yellow-500/50'
                )}
                style={{
                  left: node.position.x,
                  top: node.position.y,
                  transform: 'translate(-50%, -50%)',
                  minWidth: '150px'
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {getNodeIcon(node.type)}
                  <span className="font-medium text-sm">{node.title}</span>
                  {node.status && getStatusIcon(node.status)}
                </div>
                {node.description && (
                  <p className="text-xs text-muted-foreground">{node.description}</p>
                )}
                {node.tags && node.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {node.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {(node.executionTime || node.successRate) && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    {node.executionTime && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {node.executionTime}ms
                      </div>
                    )}
                    {node.successRate && (
                      <div className="flex items-center">
                        <Percent className="h-3 w-3 mr-1" />
                        {node.successRate}%
                      </div>
                    )}
                  </div>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{node.title}</h3>
                  <Badge variant={
                    node.type === 'agent' ? 'default' : 
                    node.type === 'logic' ? 'secondary' : 
                    node.type === 'human' ? 'outline' : 'default'
                  }>
                    {node.type}
                  </Badge>
                </div>
                
                {node.description && (
                  <p className="text-sm text-muted-foreground mb-4">{node.description}</p>
                )}
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {node.agentId && (
                    <div>
                      <div className="font-medium">Agent ID</div>
                      <div className="text-muted-foreground">{node.agentId}</div>
                    </div>
                  )}
                  
                  {node.lastRunTimestamp && (
                    <div>
                      <div className="font-medium">Last Run</div>
                      <div className="text-muted-foreground">{node.lastRunTimestamp}</div>
                    </div>
                  )}
                  
                  {node.executionTime && (
                    <div>
                      <div className="font-medium">Execution Time</div>
                      <div className="text-muted-foreground">{node.executionTime}ms</div>
                    </div>
                  )}
                  
                  {node.successRate && (
                    <div>
                      <div className="font-medium">Success Rate</div>
                      <div className="text-muted-foreground">{node.successRate}%</div>
                    </div>
                  )}
                  
                  {node.requiresApproval && (
                    <div className="col-span-2">
                      <div className="font-medium">Approval Required</div>
                      <div className="text-muted-foreground">
                        Assignee: {node.approvalAssignee || 'Unassigned'}
                        {node.approvalDeadline && ` (Due: ${node.approvalDeadline})`}
                      </div>
                    </div>
                  )}
                </div>
                
                {node.type === 'agent' && node.agentId && (
                  <div className="mt-4 text-xs">
                    <Button variant="ghost" size="sm" className="p-0 h-auto" asChild>
                      <a href={`/agent-directory?agentId=${node.agentId}`} className="text-primary hover:underline flex items-center">
                        View in Agent Directory
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        ))}
        <svg className="absolute inset-0 pointer-events-none" style={{width: '100%', height: '100%'}}>
          {connections.map((connection) => {
            const sourceNode = nodes.find(n => n.id === connection.source);
            const targetNode = nodes.find(n => n.id === connection.target);
            if (!sourceNode || !targetNode) return null;

            return (
              <g key={connection.id}>
                <line
                  x1={sourceNode.position.x}
                  y1={sourceNode.position.y}
                  x2={targetNode.position.x}
                  y2={targetNode.position.y}
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeOpacity={0.3}
                />
                {connection.label && (
                  <text
                    x={(sourceNode.position.x + targetNode.position.x) / 2}
                    y={(sourceNode.position.y + targetNode.position.y) / 2 - 10}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="12"
                    fontWeight="500"
                    className="pointer-events-none select-none"
                  >
                    {connection.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Node details modal */}
      <Dialog open={!!selectedNodeId} onOpenChange={() => setSelectedNodeId(null)}>
        {selectedNode && selectedNode.type === 'agent' && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Agent Details</DialogTitle>
            </DialogHeader>
            <AgentNodeDetails node={selectedNode} />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
