import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  BarChart3
} from 'lucide-react';

// Types
interface SwarmData {
  swarm: string;
  agents: Agent[];
  metrics: {
    workflows: number;
    approvals: number;
    memory: number;
    uptime: number;
  };
  activity: ActivityEvent[];
}

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error' | 'offline';
  type: string;
  lastActivity: string;
}

interface ActivityEvent {
  id: string;
  timestamp: string;
  event: string;
  agent?: string;
}

// Pure JS helpers
const mapStatusToColor = (status: string): string => {
  switch (status) {
    case 'active': return 'text-green-500';
    case 'idle': return 'text-yellow-500';
    case 'error': return 'text-red-500';
    case 'offline': return 'text-gray-500';
    default: return 'text-gray-400';
  }
};

const createPolling = (fn: () => void, delay: number) => {
  const interval = setInterval(fn, delay);
  return () => clearInterval(interval);
};

// Components
const SkeletonCard: React.FC = () => (
  <div className="bg-white shadow-md rounded-lg p-4 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-full"></div>
  </div>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  status?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, status }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {status && (
        <div className={`w-3 h-3 rounded-full ${mapStatusToColor(status).replace('text-', 'bg-')}`}></div>
      )}
    </div>
  </div>
);

interface HealthStatusProps {
  uptime: number;
}

const HealthStatus: React.FC<HealthStatusProps> = ({ uptime }) => {
  const getHealthColor = (uptime: number) => {
    if (uptime >= 95) return 'bg-green-500';
    if (uptime >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getHealthLabel = (uptime: number) => {
    if (uptime >= 95) return 'Healthy';
    if (uptime >= 80) return 'Warning';
    return 'Critical';
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center space-x-3">
        <div className={`w-4 h-4 rounded-full ${getHealthColor(uptime)}`}></div>
        <div>
          <p className="text-sm font-medium text-gray-600">System Health</p>
          <p className="text-lg font-semibold text-gray-900">{getHealthLabel(uptime)}</p>
          <p className="text-sm text-gray-500">{uptime.toFixed(1)}% uptime</p>
        </div>
      </div>
    </div>
  );
};

interface SwarmSwitcherProps {
  selectedSwarm: string;
  onSwarmChange: (swarm: string) => void;
  swarms: string[];
}

const SwarmSwitcher: React.FC<SwarmSwitcherProps> = ({ selectedSwarm, onSwarmChange, swarms }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Active Swarm
    </label>
    <select
      value={selectedSwarm}
      onChange={(e) => onSwarmChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    >
      <option value="">Select Swarm</option>
      {swarms.map(swarm => (
        <option key={swarm} value={swarm}>{swarm}</option>
      ))}
    </select>
  </div>
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
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Agents</h3>
        <span className="text-sm text-gray-500">{filteredAgents.length} active</span>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search agents..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-md">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${mapStatusToColor(agent.status).replace('text-', 'bg-')}`}></div>
              <div>
                <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                <p className="text-xs text-gray-500">{agent.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">{agent.lastActivity}</p>
              <p className={`text-xs font-medium ${mapStatusToColor(agent.status)}`}>
                {agent.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface RecentActivityProps {
  activity: ActivityEvent[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activity }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {activity.map(event => (
        <div key={event.id} className="flex items-start space-x-3 p-2 border-l-2 border-purple-200">
          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">{event.event}</p>
            {event.agent && (
              <p className="text-xs text-gray-500">Agent: {event.agent}</p>
            )}
            <p className="text-xs text-gray-400">{new Date(event.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const QuickActions: React.FC = () => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
    <div className="space-y-2">
      <button
        onClick={() => window.location.href = '/workflow-builder'}
        className="w-full flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
      >
        <Workflow className="w-4 h-4" />
        <span>Workflow Builder</span>
      </button>
      <button
        onClick={() => window.location.href = '/settings'}
        className="w-full flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
      >
        <Settings className="w-4 h-4" />
        <span>Settings</span>
      </button>
      <button
        onClick={() => window.location.href = '/agents'}
        className="w-full flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <Users className="w-4 h-4" />
        <span>Agent Directory</span>
      </button>
    </div>
  </div>
);

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
  const availableSwarms = ['swarm-1', 'swarm-2', 'swarm-3'];

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
      const response = await fetch(`/api/swarms/${selectedSwarm}`);
      
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
            name: 'Data Processor',
            status: 'active',
            type: 'analyzer',
            lastActivity: '2 min ago'
          },
          {
            id: 'agent-2',
            name: 'Task Coordinator',
            status: 'idle',
            type: 'coordinator',
            lastActivity: '5 min ago'
          },
          {
            id: 'agent-3',
            name: 'Memory Manager',
            status: 'active',
            type: 'memory',
            lastActivity: '1 min ago'
          },
          {
            id: 'agent-4',
            name: 'Error Handler',
            status: 'error',
            type: 'monitor',
            lastActivity: '10 min ago'
          }
        ],
        metrics: {
          workflows: 12,
          approvals: 3,
          memory: 68,
          uptime: 97.5
        },
        activity: [
          {
            id: 'act-1',
            timestamp: new Date(Date.now() - 120000).toISOString(),
            event: 'Workflow execution completed',
            agent: 'Data Processor'
          },
          {
            id: 'act-2',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            event: 'Agent coordination updated',
            agent: 'Task Coordinator'
          },
          {
            id: 'act-3',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            event: 'Memory optimization completed',
            agent: 'Memory Manager'
          },
          {
            id: 'act-4',
            timestamp: new Date(Date.now() - 900000).toISOString(),
            event: 'Error recovery initiated',
            agent: 'Error Handler'
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
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Network className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Swarm Control Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchSwarmData}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              {selectedSwarm && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Connected to {selectedSwarm}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Swarm Switcher */}
        <div className="mb-6">
          <SwarmSwitcher
            selectedSwarm={selectedSwarm}
            onSwarmChange={handleSwarmChange}
            swarms={availableSwarms}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* No Swarm Selected */}
        {!loading && !selectedSwarm && (
          <div className="text-center py-12">
            <Network className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Swarm Selected</h3>
            <p className="text-gray-500">Select a swarm from the dropdown above to view its dashboard.</p>
          </div>
        )}

        {/* Dashboard Content */}
        {!loading && swarmData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Metrics Cards */}
            <StatCard
              icon={<Workflow className="w-5 h-5 text-purple-600" />}
              label="Active Workflows"
              value={swarmData.metrics.workflows}
              status="active"
            />
            
            <StatCard
              icon={<Clock className="w-5 h-5 text-yellow-600" />}
              label="Pending Approvals"
              value={swarmData.metrics.approvals}
              status="idle"
            />
            
            <StatCard
              icon={<BarChart3 className="w-5 h-5 text-blue-600" />}
              label="Memory Usage"
              value={`${swarmData.metrics.memory}%`}
              status={swarmData.metrics.memory > 80 ? 'error' : 'active'}
            />

            {/* Health Status */}
            <HealthStatus uptime={swarmData.metrics.uptime} />

            {/* Agent List */}
            <div className="md:col-span-2 lg:col-span-1">
              <AgentList
                agents={swarmData.agents}
                searchQuery={debouncedSearch}
                onSearchChange={setSearchQuery}
              />
            </div>

            {/* Recent Activity */}
            <div className="md:col-span-2 lg:col-span-1">
              <RecentActivity activity={swarmData.activity} />
            </div>

            {/* Quick Actions */}
            <QuickActions />
          </div>
        )}
      </main>
    </div>
  );
}