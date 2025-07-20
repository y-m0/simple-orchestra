import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Settings,
  GitBranch,
  Database,
  Activity,
  Users,
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  href,
  isActive = false,
}) => {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
        isActive ? 'bg-accent' : 'transparent'
      )}
    >
      {icon}
      {label}
    </Link>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-background lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <GitBranch className="h-6 w-6" />
              <span>Orchestration Nexus</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            <SidebarItem
              icon={<LayoutDashboard className="h-4 w-4" />}
              label="Dashboard"
              href="/"
              isActive={isActive('/')}
            />
            <SidebarItem
              icon={<GitBranch className="h-4 w-4" />}
              label="Workflows"
              href="/workflows"
              isActive={isActive('/workflows')}
            />
            <SidebarItem
              icon={<Activity className="h-4 w-4" />}
              label="Activity"
              href="/activity"
              isActive={isActive('/activity')}
            />
            <SidebarItem
              icon={<Database className="h-4 w-4" />}
              label="Data Connections"
              href="/settings/data-connections"
              isActive={isActive('/settings/data-connections')}
            />
            <SidebarItem
              icon={<Users className="h-4 w-4" />}
              label="Team"
              href="/team"
              isActive={isActive('/team')}
            />
            <SidebarItem
              icon={<Settings className="h-4 w-4" />}
              label="Settings"
              href="/settings"
              isActive={isActive('/settings')}
            />
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}; 