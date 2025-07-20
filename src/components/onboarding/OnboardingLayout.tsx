
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Logo and branding */}
      <div className="w-full p-4 flex items-center border-b border-border/40">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <Home className="h-5 w-5" />
            <span className="sr-only">Back to home</span>
          </Link>
        </Button>
        <div className="flex-1 text-center font-medium">Orchestra</div>
        <ThemeToggle />
      </div>
      
      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center py-4 md:py-10 min-h-[calc(100vh-80px)]">
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
