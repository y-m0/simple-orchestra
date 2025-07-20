
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { useWorkflow } from '@/hooks/useWorkflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import type { Activity } from '@/lib/store';

export const WorkflowActivity = () => {
  const { activities } = useStore();
  const { currentWorkflow, isRunning } = useWorkflow();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = format(new Date(activity.timestamp), 'MMMM d, yyyy');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'running':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'success':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(groupedActivities).map(([date, activities]) => (
            <div key={date} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">{date}</h3>
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{activity.workflowName}</h4>
                      <p className="text-sm text-gray-500">
                        {format(new Date(activity.timestamp), 'h:mm a')}
                      </p>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedActivity?.status === 'error' ? 'Error Details' : 'Activity Details'}
              </DialogTitle>
            </DialogHeader>
            {selectedActivity && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Workflow: {selectedActivity.workflowName}</h4>
                  <p className="text-sm text-gray-500">
                    {format(new Date(selectedActivity.timestamp), 'MMMM d, yyyy h:mm a')}
                  </p>
                </div>
                {selectedActivity.status === 'error' ? (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-red-600">
                      {typeof selectedActivity.details === 'string' 
                        ? selectedActivity.details 
                        : selectedActivity.details.error || 'Unknown error'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>Steps: {typeof selectedActivity.details === 'string' 
                      ? 'N/A' 
                      : selectedActivity.details.steps || 'N/A'}</p>
                    <p>Duration: {typeof selectedActivity.details === 'string' 
                      ? 'N/A' 
                      : (selectedActivity.details.duration ? `${selectedActivity.details.duration}ms` : 'N/A')}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}; 
