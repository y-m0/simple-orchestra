// import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SwarmProvider } from '@/context/SwarmContext';
import { DashboardLayout, DashboardGrid } from '@/components/dashboard/DashboardLayout';
import { SwarmSwitcher } from '@/components/dashboard/SwarmSwitcher';
import { MetricsPanel } from '@/components/dashboard/MetricsPanel';
import { HealthStatus } from '@/components/dashboard/HealthStatus';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { 
  Home, 
  LogOut, 
  Bell, 
  RefreshCw,
  Network
} from 'lucide-react';

function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-purple-500/10 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
              <Home className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                Simple Orchestra
              </span>
              <Badge variant="secondary" className="ml-2 text-xs">
                Orchestration Nexus
              </Badge>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              2
            </Badge>
          </Button>
          
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-muted/50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">
              {user?.name || user?.email}
            </span>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

function DashboardContent() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
            <Network className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Swarm Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time orchestration metrics and swarm coordination
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <DashboardGrid columns={4}>
        {/* Left Sidebar - Swarm Switcher */}
        <div className="lg:col-span-1 space-y-6">
          <SwarmSwitcher />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Row - Metrics */}
          <MetricsPanel />
          
          {/* Middle Row - Health and Actions */}
          <DashboardGrid columns={2}>
            <HealthStatus />
            <QuickActions />
          </DashboardGrid>
          
          {/* Bottom Row - Activity */}
          <RecentActivity />
        </div>
      </DashboardGrid>

      {/* Footer Stats */}
      <div className="mt-8 p-4 rounded-lg bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/10">
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">System Status:</span>
            <span className="font-medium text-green-600">Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Mode:</span>
            <span className="font-medium text-blue-600">Demo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-muted-foreground">Version:</span>
            <span className="font-medium text-purple-600">2.0.0</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function Dashboard() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need to be logged in to access this page.</p>
          <Link to="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SwarmProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/5">
        <DashboardHeader />
        <DashboardContent />
      </div>
    </SwarmProvider>
  );
}