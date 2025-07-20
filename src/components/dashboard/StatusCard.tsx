
import React, { ReactNode } from 'react';

interface StatusCardProps {
  title: string;
  value: string | number | ReactNode;
  icon: React.ReactNode;
  trend?: string;
  trendValue?: string;
}

export function StatusCard({ title, value, icon, trend, trendValue }: StatusCardProps) {
  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-background/80 rounded-xl p-4 neo-border backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-semibold mt-2 text-gradient">{value}</h3>
          {trend && (
            <p className="text-sm mt-2">
              <span className={trend === 'up' ? 'text-green-400' : 'text-red-400'}>
                {trendValue}
              </span>
            </p>
          )}
        </div>
        <div className="text-purple-400 bg-purple-500/10 p-2 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </div>
  );
}
