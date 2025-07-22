import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-background via-background to-purple-950/5', className)}>
      <div className="container mx-auto p-6 space-y-6">
        {children}
      </div>
    </div>
  );
}

interface DashboardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function DashboardGrid({ children, columns = 2, className }: DashboardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {children}
    </div>
  );
}

interface DashboardPanelProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  glowing?: boolean;
}

export function DashboardPanel({ children, title, description, className, glowing = false }: DashboardPanelProps) {
  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-300',
      glowing && 'ring-2 ring-purple-500/20 shadow-lg shadow-purple-500/10',
      'hover:shadow-md hover:shadow-purple-500/5',
      'border-purple-500/20',
      className
    )}>
      {glowing && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      )}
      {(title || description) && (
        <div className="p-6 pb-3">
          {title && (
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      <div className={cn('relative z-10', title || description ? 'p-6 pt-3' : 'p-6')}>
        {children}
      </div>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: ReactNode;
  color?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function MetricCard({ title, value, subtitle, trend, icon, color = 'default' }: MetricCardProps) {
  const colorClasses = {
    default: 'text-foreground',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-orange-600 dark:text-orange-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400'
  };

  const trendClasses = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-muted-foreground'
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 rounded-lg bg-background/80 text-muted-foreground">
              {icon}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn('text-2xl font-bold', colorClasses[color])}>
              {value}
            </p>
            {subtitle && (
              <p className={cn('text-xs', trend ? trendClasses[trend] : 'text-muted-foreground')}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}