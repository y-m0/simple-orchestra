// Authentication types and interfaces

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin' | 'moderator';
  avatar?: string;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
}

export interface AuthSession {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name?: string;
}

export interface AuthError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export class AuthError extends Error {
  public code: string;
  public details?: Record<string, unknown>;

  constructor(code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.details = details;
  }
}

export interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: AuthError | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

export interface AuthConfig {
  apiUrl: string;
  tokenStorageKey: string;
  sessionExpiryBuffer: number; // milliseconds before expiry to refresh
}