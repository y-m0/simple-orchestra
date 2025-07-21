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

    let lastError: Error | null = null;\n\n    for (let attempt = 0; attempt <= retries; attempt++) {\n      try {\n        const response = await fetch(url.toString(), requestInit);\n\n        // Handle authentication errors\n        if (response.status === 401) {\n          this.authToken = null;\n          this.config.onUnauthorized();\n          throw new ApiError('UNAUTHORIZED', 'Authentication required', { statusCode: 401 });\n        }\n\n        // Handle other HTTP errors\n        if (!response.ok) {\n          const errorData = await response.json().catch(() => ({}));\n          throw new ApiError(\n            errorData.code || 'HTTP_ERROR',\n            errorData.message || `HTTP ${response.status}: ${response.statusText}`,\n            { statusCode: response.status, ...errorData.details }\n          );\n        }\n\n        // Parse response\n        const responseData = await response.json();\n\n        // Validate response structure if required\n        if (validateResponse && !this.isValidApiResponse(responseData)) {\n          throw new ApiError('INVALID_RESPONSE', 'Invalid API response format');\n        }\n\n        return responseData as ApiResponse<T>;\n      } catch (error) {\n        lastError = error instanceof Error ? error : new Error(String(error));\n\n        // Don't retry on auth errors or client errors (4xx)\n        if (error instanceof ApiError && error.statusCode && error.statusCode < 500) {\n          this.config.onError(error);\n          throw error;\n        }\n\n        // Don't retry on last attempt\n        if (attempt === retries) {\n          break;\n        }\n\n        // Wait before retry\n        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));\n      }\n    }\n\n    // Create final error\n    const finalError = lastError instanceof ApiError \n      ? lastError \n      : new ApiError('NETWORK_ERROR', 'Request failed after retries', { originalError: lastError });\n    \n    this.config.onError(finalError);\n    throw finalError;\n  }\n\n  private isValidApiResponse(data: unknown): data is ApiResponse {\n    return (\n      typeof data === 'object' &&\n      data !== null &&\n      'success' in data &&\n      typeof (data as ApiResponse).success === 'boolean'\n    );\n  }\n\n  // HTTP method helpers\n  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {\n    return this.request<T>(endpoint, 'GET', options);\n  }\n\n  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {\n    return this.request<T>(endpoint, 'POST', { ...options, data });\n  }\n\n  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {\n    return this.request<T>(endpoint, 'PUT', { ...options, data });\n  }\n\n  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {\n    return this.request<T>(endpoint, 'PATCH', { ...options, data });\n  }\n\n  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {\n    return this.request<T>(endpoint, 'DELETE', options);\n  }\n}\n\n// Custom error class\nclass ApiError extends Error {\n  public code: string;\n  public statusCode?: number;\n  public details?: Record<string, unknown>;\n  public originalError?: Error;\n\n  constructor(\n    code: string,\n    message: string,\n    options: { statusCode?: number; details?: Record<string, unknown>; originalError?: Error } = {}\n  ) {\n    super(message);\n    this.name = 'ApiError';\n    this.code = code;\n    this.statusCode = options.statusCode;\n    this.details = options.details;\n    this.originalError = options.originalError;\n  }\n}\n\n// API endpoints configuration\nconst endpoints: ApiEndpoints = {\n  // Authentication\n  login: { path: '/auth/login', method: 'POST', auth: false },\n  logout: { path: '/auth/logout', method: 'POST', auth: true },\n  refresh: { path: '/auth/refresh', method: 'POST', auth: false },\n  signup: { path: '/auth/signup', method: 'POST', auth: false },\n  \n  // Workflows\n  workflows: {\n    list: { path: '/workflows', method: 'GET', auth: true },\n    create: { path: '/workflows', method: 'POST', auth: true },\n    get: { path: '/workflows/:id', method: 'GET', auth: true },\n    update: { path: '/workflows/:id', method: 'PUT', auth: true },\n    delete: { path: '/workflows/:id', method: 'DELETE', auth: true },\n    execute: { path: '/workflows/:id/execute', method: 'POST', auth: true },\n    stop: { path: '/workflows/:id/stop', method: 'POST', auth: true },\n  },\n  \n  // Agents\n  agents: {\n    list: { path: '/agents', method: 'GET', auth: true },\n    create: { path: '/agents', method: 'POST', auth: true },\n    get: { path: '/agents/:id', method: 'GET', auth: true },\n    update: { path: '/agents/:id', method: 'PUT', auth: true },\n    delete: { path: '/agents/:id', method: 'DELETE', auth: true },\n    deploy: { path: '/agents/:id/deploy', method: 'POST', auth: true },\n    status: { path: '/agents/:id/status', method: 'GET', auth: true },\n  },\n  \n  // Projects\n  projects: {\n    list: { path: '/projects', method: 'GET', auth: true },\n    create: { path: '/projects', method: 'POST', auth: true },\n    get: { path: '/projects/:id', method: 'GET', auth: true },\n    update: { path: '/projects/:id', method: 'PUT', auth: true },\n    delete: { path: '/projects/:id', method: 'DELETE', auth: true },\n  },\n  \n  // Activity\n  activity: {\n    list: { path: '/activity', method: 'GET', auth: true },\n    search: { path: '/activity/search', method: 'POST', auth: true },\n  },\n  \n  // Data connections\n  connections: {\n    list: { path: '/connections', method: 'GET', auth: true },\n    create: { path: '/connections', method: 'POST', auth: true },\n    get: { path: '/connections/:id', method: 'GET', auth: true },\n    update: { path: '/connections/:id', method: 'PUT', auth: true },\n    delete: { path: '/connections/:id', method: 'DELETE', auth: true },\n    test: { path: '/connections/:id/test', method: 'POST', auth: true },\n  },\n};\n\n// Export configured client instance\nexport const apiClient = new ApiClient({\n  onUnauthorized: () => {\n    // Clear auth token and redirect to login\n    localStorage.removeItem('simple_orchestra_auth');\n    window.location.href = '/login';\n  },\n  onError: (error) => {\n    // Global error handling\n    console.error('API Error:', error);\n  },\n});\n\nexport { ApiError, endpoints };