import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  credentials: { email: string; password: string };
  setCredentials: (c: { email: string; password: string }) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  credentials,
  setCredentials,
}) => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(credentials.email, credentials.password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      // Error is already displayed by the useAuth hook
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <User className="h-4 w-4" />
          </div>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            className="pl-10 bg-background/60 backdrop-blur-sm border-purple-500/30"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Lock className="h-4 w-4" />
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="pl-10 bg-background/60 backdrop-blur-sm border-purple-500/30"
            required
          />
          <button 
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white shadow-lg shadow-purple-500/20" 
        disabled={loading}
      >
        {loading ? "Processing..." : "Access Orchestration Nexus"}
      </Button>

      <div className="bg-background/40 backdrop-blur-sm rounded-lg p-3 border border-purple-500/20">
        <h3 className="text-sm font-medium mb-2 text-purple-400">Demo Credentials</h3>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <span className="font-semibold">Email:</span>
          <span className="font-mono">test@example.com</span>
          <span className="font-semibold">Password:</span>
          <span className="font-mono">password</span>
        </div>
      </div>
    </form>
  );
};