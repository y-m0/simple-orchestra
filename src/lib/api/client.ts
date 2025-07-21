// Centralized API client with error handling and authentication

import { ApiClientConfig, RequestOptions, ApiError, ApiEndpoints } from './types';
import { ApiResponse } from '@/types/api';

class ApiClient {
  private config: Required<ApiClientConfig>;
  private authToken: string | null = null;

  constructor(config: ApiClientConfig) {
    this.config = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      headers: {},
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
      authTokenKey: 'simple_orchestra_auth',
      onUnauthorized: () => {},
      onError: () => {},
      ...config,
    };

    // Load auth token from storage
    this.loadAuthToken();
  }

  private loadAuthToken(): void {
    try {
      const stored = localStorage.getItem(this.config.authTokenKey);
      if (stored) {
        const session = JSON.parse(stored);
        this.authToken = session.access_token;
      }
    } catch {
      // Ignore errors loading token
    }
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  private async request<T>(
    endpoint: string,
    method: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.config.timeout,
      retries = this.config.retries,
      retryDelay = this.config.retryDelay,
      headers = {},
      params,
      data,
      validateResponse = true,
    } = options;

    const url = new URL(endpoint, this.config.baseURL);
    
    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const requestHeaders = {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...headers,
    };

    // Add auth header if token exists
    if (this.authToken) {
      requestHeaders.Authorization = `Bearer ${this.authToken}`;
    }

    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(timeout),
    };

    if (data && method !== 'GET') {
      requestInit.body = JSON.stringify(data);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url.toString(), requestInit);

        // Handle authentication errors
        if (response.status === 401) {
          this.authToken = null;
          this.config.onUnauthorized();
          throw new ApiError('UNAUTHORIZED', 'Authentication required', { statusCode: 401 });
        }

        // Handle other HTTP errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            errorData.code || 'HTTP_ERROR',
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            { statusCode: response.status, ...errorData.details }
          );
        }

        // Parse response
        const responseData = await response.json();

        // Validate response structure if required
        if (validateResponse && !this.isValidApiResponse(responseData)) {
          throw new ApiError('INVALID_RESPONSE', 'Invalid API response format');
        }

        return responseData as ApiResponse<T>;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on auth errors or client errors (4xx)
        if (error instanceof ApiError && error.statusCode && error.statusCode < 500) {
          this.config.onError(error);
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === retries) {
          break;
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }

    // Create final error
    const finalError = lastError instanceof ApiError 
      ? lastError 
      : new ApiError('NETWORK_ERROR', 'Request failed after retries', { originalError: lastError });
    
    this.config.onError(finalError);
    throw finalError;
  }

  private isValidApiResponse(data: unknown): data is ApiResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'success' in data &&
      typeof (data as ApiResponse).success === 'boolean'
    );
  }

  // HTTP method helpers
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', options);
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', { ...options, data });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', { ...options, data });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PATCH', { ...options, data });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', options);
  }
}

// Custom error class
class ApiError extends Error {
  public code: string;
  public statusCode?: number;
  public details?: Record<string, unknown>;
  public originalError?: Error;

  constructor(
    code: string,
    message: string,
    options: { statusCode?: number; details?: Record<string, unknown>; originalError?: Error } = {}
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = options.statusCode;
    this.details = options.details;
    this.originalError = options.originalError;
  }
}

// API endpoints configuration
const endpoints: ApiEndpoints = {
  // Authentication
  login: { path: '/auth/login', method: 'POST', auth: false },
  logout: { path: '/auth/logout', method: 'POST', auth: true },
  refresh: { path: '/auth/refresh', method: 'POST', auth: false },
  signup: { path: '/auth/signup', method: 'POST', auth: false },
  
  // Workflows
  workflows: {
    list: { path: '/workflows', method: 'GET', auth: true },
    create: { path: '/workflows', method: 'POST', auth: true },
    get: { path: '/workflows/:id', method: 'GET', auth: true },
    update: { path: '/workflows/:id', method: 'PUT', auth: true },
    delete: { path: '/workflows/:id', method: 'DELETE', auth: true },
    execute: { path: '/workflows/:id/execute', method: 'POST', auth: true },
    stop: { path: '/workflows/:id/stop', method: 'POST', auth: true },
  },
  
  // Agents
  agents: {
    list: { path: '/agents', method: 'GET', auth: true },
    create: { path: '/agents', method: 'POST', auth: true },
    get: { path: '/agents/:id', method: 'GET', auth: true },
    update: { path: '/agents/:id', method: 'PUT', auth: true },
    delete: { path: '/agents/:id', method: 'DELETE', auth: true },
    deploy: { path: '/agents/:id/deploy', method: 'POST', auth: true },
    status: { path: '/agents/:id/status', method: 'GET', auth: true },
  },
  
  // Projects
  projects: {
    list: { path: '/projects', method: 'GET', auth: true },
    create: { path: '/projects', method: 'POST', auth: true },
    get: { path: '/projects/:id', method: 'GET', auth: true },
    update: { path: '/projects/:id', method: 'PUT', auth: true },
    delete: { path: '/projects/:id', method: 'DELETE', auth: true },
  },
  
  // Activity
  activity: {
    list: { path: '/activity', method: 'GET', auth: true },
    search: { path: '/activity/search', method: 'POST', auth: true },
  },
  
  // Data connections
  connections: {
    list: { path: '/connections', method: 'GET', auth: true },
    create: { path: '/connections', method: 'POST', auth: true },
    get: { path: '/connections/:id', method: 'GET', auth: true },
    update: { path: '/connections/:id', method: 'PUT', auth: true },
    delete: { path: '/connections/:id', method: 'DELETE', auth: true },
    test: { path: '/connections/:id/test', method: 'POST', auth: true },
  },
};

// Export configured client instance
export const apiClient = new ApiClient({
  onUnauthorized: () => {
    // Clear auth token and redirect to login
    localStorage.removeItem('simple_orchestra_auth');
    window.location.href = '/login';
  },
  onError: (error) => {
    // Global error handling
    console.error('API Error:', error);
  },
});

export { ApiError, endpoints };