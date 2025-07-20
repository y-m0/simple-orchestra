
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useWorkflow } from '@/hooks/useWorkflow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { predefinedWorkflows } from '@/data/workflows';

export const ActivityTest = () => {
  const { activities } = useStore();
  const { 
    currentWorkflow,
    isRunning,
    runWorkflow,
    stopWorkflow,
    approveHumanTask,
    rejectHumanTask,
    loadWorkflow
  } = useWorkflow();
  
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('');

  const handleWorkflowSelect = (workflowId: string) => {
    setSelectedWorkflowId(workflowId);
    loadWorkflow(workflowId);
  };

  // Helper function to convert details object to string
  const formatDetails = (details: any): string => {
    if (typeof details === 'string') return details;
    if (details && typeof details === 'object') {
      return Object.entries(details)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    }
    return String(details || '');
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Activity Test Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={selectedWorkflowId} onValueChange={handleWorkflowSelect}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a workflow" />
              </SelectTrigger>
              <SelectContent>
                {predefinedWorkflows.map((workflow) => (
                  <SelectItem key={workflow.id} value={workflow.id}>
                    {workflow.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button 
                onClick={runWorkflow} 
                disabled={!currentWorkflow || isRunning}
              >
                Start Workflow
              </Button>
              <Button 
                onClick={stopWorkflow} 
                disabled={!currentWorkflow || !isRunning}
              >
                Stop Workflow
              </Button>
              {currentWorkflow?.nodes
                .filter(node => node.type === 'human' && node.requiresApproval)
                .map(node => (
                  <div key={node.id} className="flex gap-2">
                    <Button 
                      onClick={() => approveHumanTask(node.id)}
                      variant="outline"
                    >
                      Approve {node.title}
                    </Button>
                    <Button 
                      onClick={() => rejectHumanTask(node.id)}
                      variant="destructive"
                    >
                      Reject {node.title}
                    </Button>
                  </div>
                ))
              }
            </div>
          </div>
          
          {currentWorkflow && (
            <div className="mt-4">
              <h3 className="font-medium">Current Workflow: {currentWorkflow.title}</h3>
              <p className="text-sm text-gray-500">{currentWorkflow.description}</p>
              <p className="text-sm">Status: {isRunning ? 'Running' : 'Stopped'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {activities.map((activity) => (
              <div key={activity.id} className="p-2 border rounded">
                <div className="font-medium">{activity.type}</div>
                <div className="text-sm text-gray-500">{activity.timestamp}</div>
                <div className="text-sm">{formatDetails(activity.details)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
