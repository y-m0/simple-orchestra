import { createContext, useContext, useState } from 'react';

// Simplified auth context for testing
interface SimpleAuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: any;
  login: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
  signup: (credentials: any) => Promise<void>;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (credentials: any) => {
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsAuthenticated(true);
      setUser({ id: '1', email: credentials.email, name: 'Test User' });
      setLoading(false);
    }, 1000);
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const signup = async (credentials: any) => {
    await login(credentials);
  };

  return (
    <SimpleAuthContext.Provider value={{
      isAuthenticated,
      loading,
      user,
      login,
      logout,
      signup
    }}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SimpleAuthProvider');
  }
  return context;
}