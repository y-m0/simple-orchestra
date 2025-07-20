import { FC, useState } from 'react';
import { Goal } from '@/types/project';
import { Workflow, WorkflowNode, WorkflowConnection } from '@/types/workflow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface GoalToWorkflowModalProps {
  goal: Goal;
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkflow: (workflow: Partial<Workflow>) => void;
}

export const GoalToWorkflowModal: FC<GoalToWorkflowModalProps> = ({ 
  goal, 
  isOpen, 
  onClose, 
  onCreateWorkflow 
}) => {
  const [workflowTitle, setWorkflowTitle] = useState(goal.title);
  const [workflowDescription, setWorkflowDescription] = useState(goal.description);
  const [complexity, setComplexity] = useState<'low' | 'medium' | 'high'>('medium');
  const [trigger, setTrigger] = useState('manual');

  const handleSubmit = () => {
    // Create default start and end nodes
    const startNode: WorkflowNode = {
      id: `node-start-${Date.now()}`,
      type: 'io',
      title: 'Start',
      position: { x: 100, y: 100 },
      status: 'idle'
    };

    const agentNode: WorkflowNode = {
      id: `node-agent-${Date.now() + 1}`,
      type: 'agent',
      title: 'Process Data',
      position: { x: 100, y: 250 },
      description: 'Process data for ' + goal.title,
      status: 'idle',
      agentId: 'default' // Would be replaced with actual agent selection
    };

    const endNode: WorkflowNode = {
      id: `node-end-${Date.now() + 2}`,
      type: 'io',
      title: 'End',
      position: { x: 100, y: 400 },
      status: 'idle'
    };

    const startToAgentConnection: WorkflowConnection = {
      id: `conn-${startNode.id}-${agentNode.id}`,
      source: startNode.id,
      target: agentNode.id
    };

    const agentToEndConnection: WorkflowConnection = {
      id: `conn-${agentNode.id}-${endNode.id}`,
      source: agentNode.id,
      target: endNode.id
    };

    // Create workflow with metadata in a custom property
    const newWorkflow: Partial<Workflow> & { customMetadata?: any } = {
      title: workflowTitle,
      description: workflowDescription,
      complexity: complexity,
      trigger: trigger,
      nodes: [startNode, agentNode, endNode],
      connections: [startToAgentConnection, agentToEndConnection],
      // Add origin project and goal to metadata
      customMetadata: {
        originProjectId: goal.projectId,
        originGoalId: goal.id
      }
    };

    onCreateWorkflow(newWorkflow);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Workflow from Goal</DialogTitle>
          <DialogDescription>
            Turn this goal into an executable workflow. You can customize the workflow details before creation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Workflow Title</label>
            <Input
              id="title"
              value={workflowTitle}
              onChange={e => setWorkflowTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Workflow Description</label>
            <Textarea
              id="description"
              value={workflowDescription}
              onChange={e => setWorkflowDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="complexity" className="text-sm font-medium">Complexity</label>
              <Select value={complexity} onValueChange={(value: any) => setComplexity(value)}>
                <SelectTrigger id="complexity">
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="trigger" className="text-sm font-medium">Trigger Type</label>
              <Select value={trigger} onValueChange={setTrigger}>
                <SelectTrigger id="trigger">
                  <SelectValue placeholder="Select trigger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Workflow</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
