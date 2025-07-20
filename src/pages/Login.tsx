
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/lib/auth";
import { LayoutDashboard, Workflow, Activity, Settings } from "lucide-react";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is already authenticated, redirect to dashboard
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col bg-gradient-to-br from-background to-purple-950/20">
      <header className="w-full p-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Orchestra</Link>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-lg border-purple-500/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Agent Orchestration System
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the workflow dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <LoginForm 
              credentials={credentials} 
              setCredentials={setCredentials}
            />
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/80 backdrop-blur-sm px-2 text-muted-foreground">
                  Explore Features
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <Link 
                to="/dashboard" 
                className="p-3 border border-border/50 rounded-md hover:bg-accent/50 transition-colors text-center flex flex-col items-center justify-center space-y-2 group"
              >
                <LayoutDashboard 
                  className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" 
                />
                <div className="text-purple-400 font-medium group-hover:text-purple-300 transition-colors">Dashboard</div>
                <div className="text-muted-foreground mt-1 text-xs">Agent status & metrics</div>
              </Link>
              <Link 
                to="/workflows" 
                className="p-3 border border-border/50 rounded-md hover:bg-accent/50 transition-colors text-center flex flex-col items-center justify-center space-y-2 group"
              >
                <Workflow 
                  className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" 
                />
                <div className="text-purple-400 font-medium group-hover:text-purple-300 transition-colors">Workflows</div>
                <div className="text-muted-foreground mt-1 text-xs">LLM agent orchestration</div>
              </Link>
              <Link 
                to="/activity" 
                className="p-3 border border-border/50 rounded-md hover:bg-accent/50 transition-colors text-center flex flex-col items-center justify-center space-y-2 group"
              >
                <Activity 
                  className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" 
                />
                <div className="text-purple-400 font-medium group-hover:text-purple-300 transition-colors">Activity</div>
                <div className="text-muted-foreground mt-1 text-xs">Execution history</div>
              </Link>
              <Link 
                to="/settings" 
                className="p-3 border border-border/50 rounded-md hover:bg-accent/50 transition-colors text-center flex flex-col items-center justify-center space-y-2 group"
              >
                <Settings 
                  className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" 
                />
                <div className="text-purple-400 font-medium group-hover:text-purple-300 transition-colors">Settings</div>
                <div className="text-muted-foreground mt-1 text-xs">Data connections & API keys</div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
