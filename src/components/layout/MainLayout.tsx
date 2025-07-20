
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-background text-foreground w-full transition-colors duration-300">
      <main className={`mx-auto ${isMobile ? 'p-4' : 'container p-8'}`}>
        {children}
      </main>
    </div>
  );
}
