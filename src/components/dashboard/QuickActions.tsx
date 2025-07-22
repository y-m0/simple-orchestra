import React from 'react';
import { DashboardPanel } from './DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Workflow, 
  Settings, 
  Activity, 
  Users, 
  FolderOpen, 
  Clock,
  Network,
  Plus,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
  badge?: string;
  external?: boolean;
}

const primaryActions: QuickAction[] = [
  {
    title: 'Workflow Builder',
    description: 'Create and manage AI agent workflows',
    href: '/workflow-builder',
    icon: Workflow,
    color: 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
  },
  {
    title: 'Agent Directory',
    description: 'View and manage all agents',
    href: '/agents',
    icon: Users,
    color: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    badge: 'New'
  },
  {
    title: 'Swarm Control',
    description: 'Monitor and control agent swarms',
    href: '/swarm',
    icon: Network,
    color: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
  }
];

const secondaryActions: QuickAction[] = [
  {
    title: 'Activity Monitor',
    description: 'View execution logs and system activity',
    href: '/activity',
    icon: Activity,
    color: 'border-green-500/20 hover:bg-green-500/5'
  },
  {
    title: 'Projects',
    description: 'Manage orchestration projects',
    href: '/projects',
    icon: FolderOpen,
    color: 'border-orange-500/20 hover:bg-orange-500/5'
  },
  {
    title: 'Approvals',
    description: 'Review pending workflow approvals',
    href: '/approvals',
    icon: Clock,
    color: 'border-red-500/20 hover:bg-red-500/5',
    badge: '2'
  },
  {
    title: 'Settings',
    description: 'Configure connections and preferences',
    href: '/settings',
    icon: Settings,
    color: 'border-gray-500/20 hover:bg-gray-500/5'
  }
];

interface SystemAction {
  title: string;
  description: string;
  action: () => void;
  icon: React.ElementType;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
}

export function QuickActions() {
  const systemActions: SystemAction[] = [
    {
      title: 'Create Workflow',
      description: 'Start a new workflow from scratch',
      action: () => window.location.href = '/workflow-builder',
      icon: Plus,
      variant: 'default'
    },
    {
      title: 'Run Diagnostics',
      description: 'Check system health and performance',
      action: () => console.log('Running diagnostics...'),
      icon: Play,
      variant: 'outline'
    },
    {
      title: 'Pause System',
      description: 'Temporarily halt all workflow execution',
      action: () => console.log('Pausing system...'),
      icon: Pause,
      variant: 'secondary'
    },
    {
      title: 'Refresh Data',
      description: 'Reload all dashboard metrics',
      action: () => window.location.reload(),
      icon: RotateCcw,
      variant: 'outline'
    }
  ];

  return (
    <DashboardPanel 
      title="Quick Actions"
      description="Common orchestration tasks and system controls"
    >
      <div className="space-y-6">
        {/* Primary Actions */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Primary Actions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {primaryActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <div className={`
                  group relative p-4 rounded-lg text-white transition-all cursor-pointer
                  ${action.color}
                  hover:shadow-lg hover:shadow-purple-500/20
                `}>
                  {action.badge && (
                    <Badge 
                      className="absolute -top-2 -right-2 bg-red-500 text-white border-0"
                      variant="secondary"
                    >
                      {action.badge}
                    </Badge>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white/20">
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm opacity-90">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Secondary Actions */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Navigation</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {secondaryActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <div className={`
                  group relative p-3 rounded-lg border transition-all cursor-pointer
                  ${action.color}
                  hover:shadow-md
                `}>
                  {action.badge && (
                    <Badge 
                      className="absolute -top-2 -right-2 bg-red-500 text-white border-0 text-xs px-2 py-0.5"
                      variant="secondary"
                    >
                      {action.badge}
                    </Badge>
                  )}
                  <div className="text-center">
                    <div className="mx-auto w-8 h-8 mb-2 flex items-center justify-center rounded-lg bg-muted/50">
                      <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">{action.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* System Actions */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">System Controls</h4>
          <div className="grid grid-cols-2 gap-2">
            {systemActions.map((action) => (
              <Button
                key={action.title}
                variant={action.variant}
                size="sm"
                onClick={action.action}
                className="h-auto p-3 flex-col gap-1 text-left"
              >
                <div className="flex items-center gap-2 w-full">
                  <action.icon className="h-4 w-4" />
                  <span className="font-medium text-xs">{action.title}</span>
                </div>
                <span className="text-xs text-muted-foreground w-full">
                  {action.description}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-3 rounded-lg bg-muted/30">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Quick Stats</h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">3</div>
              <div className="text-xs text-muted-foreground">Active Workflows</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">5</div>
              <div className="text-xs text-muted-foreground">Running Agents</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">2</div>
              <div className="text-xs text-muted-foreground">Pending Tasks</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardPanel>
  );
}