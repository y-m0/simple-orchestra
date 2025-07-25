// Secure authentication service with mock implementation

import { AuthConfig, User, AuthSession, LoginCredentials, SignupCredentials, AuthError } from './types';

// Mock user database
const mockUsers = new Map<string, { email: string; password: string; name: string; id: string }>([
  ['test@example.com', { 
    email: 'test@example.com', 
    password: 'password', 
    name: 'Test User',
    id: 'user-1'
  }]
]);

class AuthService {
  private config: AuthConfig;
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const email = credentials.email.toLowerCase().trim();
      const mockUser = mockUsers.get(email);

      if (!mockUser || mockUser.password !== credentials.password) {
        throw createAuthError('INVALID_CREDENTIALS', 'Invalid email or password');
      }

      // Create mock session
      const session: AuthSession = {
        access_token: `mock_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
        expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: 'user',
          avatar: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email_verified: true,
        },
      };
      
      this.storeSession(session);
      this.scheduleTokenRefresh(session);
      
      return session;
    } catch (error) {
      // Try demo authentication if network fails or API is unavailable
      if (!(error instanceof AuthError) || error.code === 'NETWORK_ERROR') {
        return this.tryDemoAuthentication(credentials);
      }
      throw error;
    }
  }

  private async tryDemoAuthentication(credentials: LoginCredentials): Promise<AuthSession> {
    // Simulate network delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 500));

    const email = credentials.email.toLowerCase().trim();
    const password = credentials.password;

    // Demo credentials
    if (email === 'test@example.com' && password === 'password') {
      const demoSession: AuthSession = {
        access_token: 'demo_access_token_' + Date.now(),
        refresh_token: 'demo_refresh_token_' + Date.now(),
        expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        user: {
          id: 'demo_user_1',
          email: 'test@example.com',
          name: 'Demo User',
          role: 'user',
          avatar: undefined,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          email_verified: true,
        },
      };

      this.storeSession(demoSession);
      this.scheduleTokenRefresh(demoSession);
      
      return demoSession;
    }

    // Invalid demo credentials
    throw createAuthError('INVALID_CREDENTIALS', 'Invalid email or password. Use test@example.com / password for demo.');
  }

  async signup(credentials: SignupCredentials): Promise<void> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const email = credentials.email.toLowerCase().trim();
      
      if (mockUsers.has(email)) {
        throw createAuthError('EMAIL_EXISTS', 'An account with this email already exists');
      }

      // Add new user to mock database
      mockUsers.set(email, {
        email,
        password: credentials.password,
        name: credentials.name || 'User',
        id: `user-${Date.now()}`
      });

    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw createAuthError('NETWORK_ERROR', 'Account creation failed');
    }
  }

  async logout(): Promise<void> {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Mock logout always succeeds
    } finally {
      this.clearSession();
    }
  }

  async refreshToken(): Promise<AuthSession> {
    const session = this.getStoredSession();
    if (!session?.refresh_token) {
      throw createAuthError('NO_REFRESH_TOKEN', 'No refresh token available');
    }

    // Handle demo session refresh
    if (session.access_token.startsWith('demo_access_token_')) {
      const refreshedDemoSession: AuthSession = {
        ...session,
        access_token: 'demo_access_token_' + Date.now(),
        refresh_token: 'demo_refresh_token_' + Date.now(),
        expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };
      
      this.storeSession(refreshedDemoSession);
      this.scheduleTokenRefresh(refreshedDemoSession);
      
      return refreshedDemoSession;
    }

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Create new mock session
      const newSession: AuthSession = {
        ...session,
        access_token: `mock_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
        expires_at: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      };
      
      this.storeSession(newSession);
      this.scheduleTokenRefresh(newSession);
      
      return newSession;
    } catch (error) {
      this.clearSession();
      if (error instanceof AuthError) {
        throw error;
      }
      throw createAuthError('NETWORK_ERROR', 'Failed to refresh authentication token');
    }
  }

  getStoredSession(): AuthSession | null {
    try {
      const stored = localStorage.getItem(this.config.tokenStorageKey);
      if (!stored) return null;

      const session = JSON.parse(stored) as AuthSession;
      
      // Check if session is expired
      if (Date.now() >= session.expires_at) {
        this.clearSession();
        return null;
      }

      return session;
    } catch {
      this.clearSession();
      return null;
    }
  }

  private validateSession(data: unknown): AuthSession {
    if (!data || typeof data !== 'object') {
      throw createAuthError('INVALID_RESPONSE', 'Invalid authentication response');
    }

    const session = data as Record<string, unknown>;
    
    if (!session.access_token || typeof session.access_token !== 'string') {
      throw createAuthError('INVALID_RESPONSE', 'Missing access token');
    }

    if (!session.user || typeof session.user !== 'object') {
      throw createAuthError('INVALID_RESPONSE', 'Missing user data');
    }

    const user = session.user as Record<string, unknown>;
    
    if (!user.id || !user.email) {
      throw createAuthError('INVALID_RESPONSE', 'Invalid user data');
    }

    return {
      access_token: session.access_token,
      refresh_token: session.refresh_token as string,
      expires_at: (session.expires_at as number) || Date.now() + (24 * 60 * 60 * 1000), // 24h default
      user: {
        id: user.id as string,
        email: user.email as string,
        name: user.name as string,
        role: (user.role as User['role']) || 'user',
        avatar: user.avatar as string,
        created_at: user.created_at as string,
        updated_at: user.updated_at as string,
        email_verified: Boolean(user.email_verified),
      },
    };
  }

  private storeSession(session: AuthSession): void {
    try {
      localStorage.setItem(this.config.tokenStorageKey, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to store authentication session:', error);
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.config.tokenStorageKey);
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private scheduleTokenRefresh(session: AuthSession): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const timeUntilRefresh = Math.max(
      session.expires_at - Date.now() - this.config.sessionExpiryBuffer,
      60000 // Minimum 1 minute
    );

    this.refreshTimer = setTimeout(() => {
      this.refreshToken().catch(console.error);
    }, timeUntilRefresh);
  }
}

// Helper function to create AuthError objects
function createAuthError(code: string, message: string, details?: Record<string, unknown>): AuthError {
  const error = new Error(message) as AuthError;
  error.name = 'AuthError';
  error.code = code;
  error.details = details;
  return error;
}

// Export configured service instance
const authConfig: AuthConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  tokenStorageKey: 'simple_orchestra_auth',
  sessionExpiryBuffer: 5 * 60 * 1000, // 5 minutes
};

export const authService = new AuthService(authConfig);
export { AuthError };