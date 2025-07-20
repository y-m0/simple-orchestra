import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession?.user);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession?.user);
      setLoading(false);
    }).catch((err) => {
      console.error('Error getting session:', err);
      setError(err.message);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For demo purposes, allow login with test credentials
      if (email === 'test@example.com' && password === 'password') {
        // Mock successful login
        const mockUser = {
          id: 'test-user-id',
          email: 'test@example.com',
          user_metadata: { name: 'Test User' }
        };
        
        setUser(mockUser as User);
        setIsAuthenticated(true);
        
        // Store mock session in localStorage for persistence
        localStorage.setItem('supabase.auth.token', JSON.stringify({
          currentSession: {
            access_token: 'mock-token',
            user: mockUser
          }
        }));
        
        toast({
          title: "Login successful",
          description: "You have been successfully logged in with demo credentials.",
        });
        
        return Promise.resolve();
      }
      
      // Real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      setUser(data.user);
      setSession(data.session);
      setIsAuthenticated(true);

      toast({
        title: "Login successful",
        description: "You have been successfully logged in.",
      });

      return Promise.resolve();
    } catch (error: any) {
      setError(error.message);
      setIsAuthenticated(false);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Check if we're using mock auth
      if (user?.email === 'test@example.com') {
        // Clear mock session
        localStorage.removeItem('supabase.auth.token');
        setUser(null);
        setSession(null);
        setIsAuthenticated(false);
        
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        
        return Promise.resolve();
      }
      
      // Real logout
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setUser(null);
      setSession(null);
      setIsAuthenticated(false);

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      return Promise.resolve();
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message,
      });
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // For demo purposes, simulate successful signup
      if (email === 'test@example.com') {
        // Just use the login function for the demo account
        await login(email, password);
        
        toast({
          title: "Account Created",
          description: "Your demo account has been created successfully.",
        });
        
        return Promise.resolve();
      }
      
      // Real signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Note: Supabase might require email confirmation
      if (data.user?.identities?.length === 0) {
        toast({
          title: "Email already registered",
          description: "This email is already registered. Please login instead.",
        });
      } else {
        toast({
          title: "Account Created",
          description: "Your account has been created successfully. Please check your email for confirmation.",
        });
      }
      
      return Promise.resolve();
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}