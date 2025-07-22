// Secure authentication service

import { AuthConfig, User, AuthSession, LoginCredentials, SignupCredentials, AuthError } from './types';

class AuthService {
  private config: AuthConfig;
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    try {
      const response = await fetch(`${this.config.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email.toLowerCase().trim(),
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AuthError(
          errorData.code || 'AUTH_ERROR',
          errorData.message || 'Authentication failed'
        );
      }

      const sessionData = await response.json();
      const session = this.validateSession(sessionData);
      
      this.storeSession(session);
      this.scheduleTokenRefresh(session);
      
      return session;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('NETWORK_ERROR', 'Failed to connect to authentication service');
    }
  }

  async signup(credentials: SignupCredentials): Promise<void> {
    try {
      const response = await fetch(`${this.config.apiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email.toLowerCase().trim(),
          password: credentials.password,
          name: credentials.name?.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AuthError(
          errorData.code || 'SIGNUP_ERROR',
          errorData.message || 'Account creation failed'
        );
      }
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('NETWORK_ERROR', 'Failed to connect to authentication service');
    }
  }

  async logout(): Promise<void> {
    try {
      const session = this.getStoredSession();
      if (session) {
        await fetch(`${this.config.apiUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        }).catch(() => {
          // Ignore logout errors - clear local session anyway
        });
      }
    } finally {
      this.clearSession();
    }
  }

  async refreshToken(): Promise<AuthSession> {
    const session = this.getStoredSession();
    if (!session?.refresh_token) {
      throw new AuthError('NO_REFRESH_TOKEN', 'No refresh token available');
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: session.refresh_token,
        }),
      });

      if (!response.ok) {
        throw new AuthError('REFRESH_FAILED', 'Token refresh failed');
      }

      const newSessionData = await response.json();
      const newSession = this.validateSession(newSessionData);
      
      this.storeSession(newSession);
      this.scheduleTokenRefresh(newSession);
      
      return newSession;
    } catch (error) {
      this.clearSession();
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('NETWORK_ERROR', 'Failed to refresh authentication token');
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
      throw new AuthError('INVALID_RESPONSE', 'Invalid authentication response');
    }

    const session = data as Record<string, unknown>;
    
    if (!session.access_token || typeof session.access_token !== 'string') {
      throw new AuthError('INVALID_RESPONSE', 'Missing access token');
    }

    if (!session.user || typeof session.user !== 'object') {
      throw new AuthError('INVALID_RESPONSE', 'Missing user data');
    }

    const user = session.user as Record<string, unknown>;
    
    if (!user.id || !user.email) {
      throw new AuthError('INVALID_RESPONSE', 'Invalid user data');
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

// Custom error class for authentication errors
class AuthError extends Error {
  public code: string;
  public details?: Record<string, unknown>;

  constructor(code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.details = details;
  }
}

// Export configured service instance
const authConfig: AuthConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  tokenStorageKey: 'simple_orchestra_auth',
  sessionExpiryBuffer: 5 * 60 * 1000, // 5 minutes
};

export const authService = new AuthService(authConfig);
export { AuthError };