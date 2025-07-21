import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthContextType, User, AuthSession, LoginCredentials, SignupCredentials, AuthError } from './types';
import { authService } from './authService';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session on mount
    const checkExistingSession = () => {
      try {
        const existingSession = authService.getStoredSession();
        if (existingSession) {
          setSession(existingSession);
          setUser(existingSession.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Error checking existing session:', err);
        setError(err instanceof AuthError ? err : new AuthError('SESSION_ERROR', 'Failed to restore session'));
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const newSession = await authService.login(credentials);
      
      setSession(newSession);
      setUser(newSession.user);
      setIsAuthenticated(true);

      toast({
        title: "Login successful",
        description: "You have been successfully logged in.",
      });
    } catch (err) {
      const authError = err instanceof AuthError ? err : new AuthError('LOGIN_ERROR', 'Login failed');
      setError(authError);
      setIsAuthenticated(false);
      
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: authError.message,
      });
      
      throw authError;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      await authService.logout();
      
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setError(null);

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (err) {
      const authError = err instanceof AuthError ? err : new AuthError('LOGOUT_ERROR', 'Logout failed');
      setError(authError);
      
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: authError.message,
      });
      
      throw authError;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.signup(credentials);
      
      toast({
        title: "Account Created",
        description: "Your account has been created successfully. Please check your email for confirmation.",
      });
    } catch (err) {
      const authError = err instanceof AuthError ? err : new AuthError('SIGNUP_ERROR', 'Account creation failed');
      setError(authError);
      
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: authError.message,
      });
      
      throw authError;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const refreshToken = useCallback(async () => {
    try {
      const newSession = await authService.refreshToken();
      setSession(newSession);
      setUser(newSession.user);
    } catch (err) {
      const authError = err instanceof AuthError ? err : new AuthError('REFRESH_ERROR', 'Token refresh failed');
      setError(authError);
      // Force logout on refresh failure
      await logout();
    }
  }, [logout]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        signup,
        refreshToken,
        clearError,
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