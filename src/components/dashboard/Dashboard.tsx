import React from 'react';
import { useStore, Activity } from '../../lib/store';
import { useWorkflowStore } from '../../lib/workflowStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  Activity as ActivityIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import ClaudeFlowDashboard from './ClaudeFlowDashboard';
import ClaudeFlowTaskTrigger from './ClaudeFlowTaskTrigger';
import ClaudeFlowStatus from './ClaudeFlowStatus';
import ClaudeFlowSecurity from './ClaudeFlowSecurity';

const StatusCard: React.FC<{
  title: string;
  value: string | number;
  description: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}> = ({ title, value, description, status = 'info' }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className={`h-4 w-4 ${getStatusColor()}`} />;
      case 'warning':
        return <AlertCircle className={`h-4 w-4 ${getStatusColor()}`} />;
      case 'error':
        return <XCircle className={`h-4 w-4 ${getStatusColor()}`} />;
      default:
        return <Clock className={`h-4 w-4 ${getStatusColor()}`} />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {getStatusIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

interface ActivityItemProps {
  type: string;
  status: string;
  details: string;
  timestamp: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ type, status, details, timestamp }) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'success':
        return <Badge variant="default">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'running':
        return <Badge variant="secondary">Running</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <ActivityIcon className="h-5 w-5 text-muted-foreground" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{type}</p>
        <p className="text-sm text-muted-foreground">{details}</p>
      </div>
      <div className="flex items-center gap-2">
        {getStatusBadge()}
        <span className="text-xs text-muted-foreground">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { activities } = useStore();
  const { workflows } = useWorkflowStore();

  const activeWorkflows = workflows.filter((w: any) => w.status === 'active').length;
  const completedWorkflows = activities.filter(
    (a: Activity) => a.type === 'workflow' && a.status === 'success'
  ).length;
  const failedWorkflows = activities.filter(
    (a: Activity) => a.type === 'workflow' && a.status === 'error'
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard
          title="Active Workflows"
          value={activeWorkflows}
          description="Currently running workflows"
          status="info"
        />
        <StatusCard
          title="Completed Workflows"
          value={completedWorkflows}
          description="Successfully completed workflows"
          status="success"
        />
        <StatusCard
          title="Failed Workflows"
          value={failedWorkflows}
          description="Workflows with errors"
          status="error"
        />
        <StatusCard
          title="Total Workflows"
          value={workflows.length}
          description="Total workflows in system"
          status="info"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ActivityIcon className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {activities.slice(0, 10).map((activity: Activity) => (
                <ActivityItem
                  key={activity.id}
                  type={activity.type}
                  status={activity.status}
                  details={
                    typeof activity.details === 'string'
                      ? activity.details
                      : JSON.stringify(activity.details)
                  }
                  timestamp={activity.timestamp}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <ClaudeFlowDashboard />
      <ClaudeFlowTaskTrigger />
      <ClaudeFlowStatus />
      <ClaudeFlowSecurity />
    </div>
  );
}; 