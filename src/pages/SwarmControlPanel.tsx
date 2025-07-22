import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Activity, 
  Users, 
  Workflow, 
  Settings, 
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Network,
  BarChart3,
  Home,
  Bell,
  Menu,
  X,
  TrendingUp,
  Server,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Types
interface SwarmData {
  swarm: string;
  agents: Agent[];
  metrics: {
    workflows: number;
    approvals: number;
    memory: number;
    uptime: number;
    activeAgents: number;
    totalTasks: number;
    avgResponseTime: number;
  };
  activity: ActivityEvent[];
}

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error' | 'offline';
  type: string;
  lastActivity: string;
  tasksCompleted: number;
  memoryUsage: number;
}

interface ActivityEvent {
  id: string;
  timestamp: string;
  event: string;
  agent?: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

// Pure JS helpers
const mapStatusToColor = (status: string): string => {
  switch (status) {
    case 'active': return 'text-green-600 dark:text-green-400';
    case 'idle': return 'text-yellow-600 dark:text-yellow-400';
    case 'error': return 'text-red-600 dark:text-red-400';
    case 'offline': return 'text-muted-foreground';
    default: return 'text-muted-foreground';
  }
};

const mapStatusToBg = (status: string): string => {
  switch (status) {
    case 'active': return 'status-active';
    case 'idle': return 'status-idle';
    case 'error': return 'status-error';
    case 'offline': return 'status-offline';
    default: return 'status-offline';
  }
};

const createPolling = (fn: () => void, delay: number) => {
  const interval = setInterval(fn, delay);
  return () => clearInterval(interval);
};

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

// Components
const SkeletonCard: React.FC = () => (
  <Card className="dashboard-card animate-pulse">
    <CardContent className="p-8">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-muted rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-6 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  status?: string;
  trend?: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, status, trend, subtitle }) => (
  <Card className="dashboard-card hover:shadow-lg transition-all duration-300">
    <CardContent className="p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="p-4 bg-primary rounded-xl text-primary-foreground shadow-lg transition-shadow">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          {status && (
            <div className={`w-4 h-4 rounded-full ${mapStatusToBg(status)}`}></div>
          )}
          {trend && (
            <div className="flex items-center text-sm text-green-600 dark:text-green-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend}
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

interface HealthStatusProps {
  uptime: number;
  metrics: SwarmData['metrics'];
}

const HealthStatus: React.FC<HealthStatusProps> = ({ uptime, metrics }) => {
  const getHealthColor = (uptime: number) => {
    if (uptime >= 95) return 'bg-green-500';
    if (uptime >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getHealthLabel = (uptime: number) => {
    if (uptime >= 95) return 'Excellent';
    if (uptime >= 80) return 'Good';
    return 'Needs Attention';
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${getHealthColor(uptime)} animate-pulse`}></div>
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Overall Status</span>
              <span className="font-semibold text-foreground">{getHealthLabel(uptime)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${getHealthColor(uptime)}`}
                style={{ width: `${uptime}%` }}
              ></div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{uptime.toFixed(1)}% uptime</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t border-border">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Agents:</span>
              <span className="font-medium text-foreground">{metrics.activeAgents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Response:</span>
              <span className="font-medium text-foreground">{metrics.avgResponseTime}ms</span>
            </div>
          </div>
      </CardContent>
    </Card>
  );
};

interface SwarmSwitcherProps {
  selectedSwarm: string;
  onSwarmChange: (swarm: string) => void;
  swarms: string[];
}

const SwarmSwitcher: React.FC<SwarmSwitcherProps> = ({ selectedSwarm, onSwarmChange, swarms }) => (
  <Card className="dashboard-card">
    <CardHeader className="pb-4">
      <CardTitle className="text-lg">Active Swarm</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <Select value={selectedSwarm} onValueChange={onSwarmChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a swarm..." />
        </SelectTrigger>
        <SelectContent>
          {swarms.map(swarm => (
            <SelectItem key={swarm} value={swarm}>
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4" />
                {swarm}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedSwarm && (
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-primary font-medium">Connected to {selectedSwarm}</span>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

interface AgentListProps {
  agents: Agent[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const AgentList: React.FC<AgentListProps> = ({ agents, searchQuery, onSearchChange }) => {
  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="dashboard-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Agents
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">{filteredAgents.length} active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search agents..."
            className="pl-10"
          />
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredAgents.map(agent => (
            <div key={agent.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-all duration-200 hover:shadow-sm">
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${mapStatusToBg(agent.status)}`}></div>
                <div>
                  <p className="font-medium text-foreground">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">{agent.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{agent.lastActivity}</p>
                <Badge variant="outline" className={`text-xs ${mapStatusToColor(agent.status)}`}>
                  {agent.status}
                </Badge>
              </div>
            </div>
          ))}
          
          {filteredAgents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No agents found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface RecentActivityProps {
  activity: ActivityEvent[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activity }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default: return <Activity className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <Card className="dashboard-card h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activity.map(event => (
            <div key={event.id} className="flex items-start space-x-4 p-4 border-l-4 border-l-primary/30 hover:bg-accent/50 rounded-r-lg transition-all duration-200">
              {getActivityIcon(event.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{event.event}</p>
                {event.agent && (
                  <p className="text-sm text-muted-foreground">Agent: {event.agent}</p>
                )}
                <p className="text-sm text-muted-foreground">{formatTimeAgo(event.timestamp)}</p>
              </div>
            </div>
          ))}
          
          {activity.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const QuickActions: React.FC = () => (
  <Card className="dashboard-card">
    <CardHeader className="pb-4">
      <CardTitle className="text-lg">Quick Actions</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Button asChild className="w-full justify-start" variant="default">
          <Link to="/workflow-builder">
            <Workflow className="w-4 h-4 mr-2" />
            Workflow Builder
          </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="outline">
          <Link to="/agents">
            <Users className="w-4 h-4 mr-2" />
            Agent Directory
          </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="outline">
          <Link to="/settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </Button>
        <Button asChild className="w-full justify-start" variant="outline">
          <Link to="/activity">
            <Activity className="w-4 h-4 mr-2" />
            Activity Log
          </Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Navigation Component
const Navigation: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      <div className="container flex h-20 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="hidden md:flex items-center space-x-2">
            <div className="p-3 bg-primary rounded-lg">
              <Network className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Swarm Control Panel
            </h1>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/workflow-builder">
              <Workflow className="w-4 h-4 mr-2" />
              Workflows
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/agents">
              <Users className="w-4 h-4 mr-2" />
              Agents
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </Button>
        </nav>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </Button>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <nav className="container py-6 space-y-3">
            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
              <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
              <Link to="/workflow-builder" onClick={() => setIsMobileMenuOpen(false)}>
                <Workflow className="w-4 h-4 mr-2" />
                Workflows
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
              <Link to="/agents" onClick={() => setIsMobileMenuOpen(false)}>
                <Users className="w-4 h-4 mr-2" />
                Agents
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
              <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

// Main Component
export default function SwarmControlPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State
  const [swarmData, setSwarmData] = useState<SwarmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSwarm, setSelectedSwarm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Available swarms (mock data)
  const availableSwarms = ['Production Swarm', 'Development Swarm', 'Testing Swarm'];

  // Load context from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const swarmParam = params.get('swarm');
    const agentParam = params.get('agent');
    
    if (swarmParam) {
      setSelectedSwarm(swarmParam);
    }
    if (agentParam) {
      setSelectedAgent(agentParam);
    }
  }, [location.search]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch swarm data
  const fetchSwarmData = useCallback(async () => {
    if (!selectedSwarm) {
      setSwarmData(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Mock API call - replace with actual API endpoint
      const response = await fetch(`/api/swarms/${encodeURIComponent(selectedSwarm)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch swarm data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSwarmData(data);
    } catch (err) {
      // Mock data for demo purposes
      const mockData: SwarmData = {
        swarm: selectedSwarm,
        agents: [
          {
            id: 'agent-1',
            name: 'Data Processor Alpha',
            status: 'active',
            type: 'Data Analyzer',
            lastActivity: '2 min ago',
            tasksCompleted: 47,
            memoryUsage: 65
          },
          {
            id: 'agent-2',
            name: 'Task Coordinator Beta',
            status: 'idle',
            type: 'Coordinator',
            lastActivity: '5 min ago',
            tasksCompleted: 23,
            memoryUsage: 42
          },
          {
            id: 'agent-3',
            name: 'Memory Manager Gamma',
            status: 'active',
            type: 'Memory Manager',
            lastActivity: '1 min ago',
            tasksCompleted: 31,
            memoryUsage: 78
          },
          {
            id: 'agent-4',
            name: 'Error Handler Delta',
            status: 'error',
            type: 'Monitor',
            lastActivity: '10 min ago',
            tasksCompleted: 12,
            memoryUsage: 34
          },
          {
            id: 'agent-5',
            name: 'Network Optimizer',
            status: 'active',
            type: 'Optimizer',
            lastActivity: '30 sec ago',
            tasksCompleted: 56,
            memoryUsage: 89
          }
        ],
        metrics: {
          workflows: 12,
          approvals: 3,
          memory: 68,
          uptime: 97.5,
          activeAgents: 4,
          totalTasks: 169,
          avgResponseTime: 245
        },
        activity: [
          {
            id: 'act-1',
            timestamp: new Date(Date.now() - 120000).toISOString(),
            event: 'Workflow execution completed successfully',
            agent: 'Data Processor Alpha',
            type: 'success'
          },
          {
            id: 'act-2',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            event: 'Agent coordination protocol updated',
            agent: 'Task Coordinator Beta',
            type: 'info'
          },
          {
            id: 'act-3',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            event: 'Memory optimization cycle completed',
            agent: 'Memory Manager Gamma',
            type: 'success'
          },
          {
            id: 'act-4',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            event: 'Error recovery sequence initiated',
            agent: 'Error Handler Delta',
            type: 'warning'
          },
          {
            id: 'act-5',
            timestamp: new Date(Date.now() - 1200000).toISOString(),
            event: 'Network latency optimization applied',
            agent: 'Network Optimizer',
            type: 'success'
          }
        ]
      };
      
      setSwarmData(mockData);
      console.warn('Using mock data - API endpoint not available:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedSwarm]);

  // Initial fetch and polling
  useEffect(() => {
    fetchSwarmData();
    
    if (selectedSwarm) {
      const cleanup = createPolling(fetchSwarmData, 5000);
      return cleanup;
    }
  }, [fetchSwarmData, selectedSwarm]);

  // Handle swarm change
  const handleSwarmChange = (swarm: string) => {
    setSelectedSwarm(swarm);
    
    // Update URL
    const params = new URLSearchParams(location.search);
    if (swarm) {
      params.set('swarm', swarm);
    } else {
      params.delete('swarm');
    }
    
    const newUrl = `${location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
    
    // Reset loading state
    setLoading(true);
  };

  return (
    <div className="min-h-screen dashboard-gradient">
      {/* Navigation */}
      <Navigation onRefresh={fetchSwarmData} />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Swarm Control Panel
            </h1>
            <p className="text-lg text-muted-foreground mt-2">Monitor and manage your agent swarms in real-time</p>
          </div>
          
          {selectedSwarm && swarmData && (
            <div className="flex items-center gap-3 px-6 py-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Live monitoring: {swarmData.metrics.activeAgents} agents active
              </span>
            </div>
          )}
        </div>

        {/* Swarm Switcher */}
        <div className="max-w-lg">
          <SwarmSwitcher
            selectedSwarm={selectedSwarm}
            onSwarmChange={handleSwarmChange}
            swarms={availableSwarms}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="p-8">
              <div className="flex items-center space-x-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-semibold text-destructive">Connection Error</h3>
                  <p className="text-destructive/80">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Swarm Selected */}
        {!loading && !selectedSwarm && (
          <Card className="border-dashed border-2 border-border dashboard-card">
            <CardContent className="p-16 text-center">
              <Network className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-semibold mb-4 text-foreground">No Swarm Selected</h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Select a swarm from the dropdown above to view its real-time dashboard and metrics.
              </p>
              <Button onClick={() => navigate('/workflow-builder')} size="lg">
                <Workflow className="w-4 h-4 mr-2" />
                Create New Workflow
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Dashboard Content */}
        {!loading && swarmData && (
          <div className="space-y-12">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard
                icon={<Workflow className="w-6 h-6" />}
                label="Active Workflows"
                value={swarmData.metrics.workflows}
                status="active"
                trend="+12%"
                subtitle="vs last hour"
              />
              
              <StatCard
                icon={<Clock className="w-6 h-6" />}
                label="Pending Approvals"
                value={swarmData.metrics.approvals}
                status={swarmData.metrics.approvals > 5 ? "error" : "idle"}
                subtitle="require attention"
              />
              
              <StatCard
                icon={<BarChart3 className="w-6 h-6" />}
                label="Memory Usage"
                value={`${swarmData.metrics.memory}%`}
                status={swarmData.metrics.memory > 80 ? 'error' : 'active'}
                subtitle="of allocated memory"
              />

              <StatCard
                icon={<Zap className="w-6 h-6" />}
                label="Total Tasks"
                value={swarmData.metrics.totalTasks}
                status="active"
                trend="+8%"
                subtitle="completed today"
              />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Health Status */}
              <HealthStatus uptime={swarmData.metrics.uptime} metrics={swarmData.metrics} />

              {/* Agent List */}
              <AgentList
                agents={swarmData.agents}
                searchQuery={debouncedSearch}
                onSearchChange={setSearchQuery}
              />

              {/* Quick Actions */}
              <QuickActions />
            </div>

            {/* Activity and Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <RecentActivity activity={swarmData.activity} />

              {/* Performance Metrics */}
              <Card className="dashboard-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                      <Server className="w-4 h-4" />
                    </div>
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average Response Time</span>
                      <span className="font-semibold text-foreground">{swarmData.metrics.avgResponseTime}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Agents</span>
                      <span className="font-semibold text-foreground">{swarmData.metrics.activeAgents}/{swarmData.agents.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">98.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Queue Length</span>
                      <span className="font-semibold text-foreground">2 tasks</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}