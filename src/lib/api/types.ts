// HTTP client types and configuration

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  baseURL?: string;
}

export interface ApiClientConfig extends RequestConfig {
  authTokenKey?: string;
  onUnauthorized?: () => void;
  onError?: (error: ApiError) => void;
}

export interface RequestOptions extends RequestConfig {
  params?: Record<string, unknown>;
  data?: unknown;
  validateResponse?: boolean;
}

export interface ApiError extends Error {
  code: string;
  statusCode?: number;
  details?: Record<string, unknown>;
  originalError?: Error;
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  auth?: boolean;
}

export interface ApiEndpoints {
  // Authentication
  login: ApiEndpoint;
  logout: ApiEndpoint;
  refresh: ApiEndpoint;
  signup: ApiEndpoint;
  
  // Workflows
  workflows: {
    list: ApiEndpoint;
    create: ApiEndpoint;
    get: ApiEndpoint;
    update: ApiEndpoint;
    delete: ApiEndpoint;
    execute: ApiEndpoint;
    stop: ApiEndpoint;
  };
  
  // Agents
  agents: {
    list: ApiEndpoint;
    create: ApiEndpoint;
    get: ApiEndpoint;
    update: ApiEndpoint;
    delete: ApiEndpoint;
    deploy: ApiEndpoint;
    status: ApiEndpoint;
  };
  
  // Projects
  projects: {
    list: ApiEndpoint;
    create: ApiEndpoint;
    get: ApiEndpoint;
    update: ApiEndpoint;
    delete: ApiEndpoint;
  };
  
  // Activity
  activity: {
    list: ApiEndpoint;
    search: ApiEndpoint;
  };
  
  // Data connections
  connections: {
    list: ApiEndpoint;
    create: ApiEndpoint;
    get: ApiEndpoint;
    update: ApiEndpoint;
    delete: ApiEndpoint;
    test: ApiEndpoint;
  };
}