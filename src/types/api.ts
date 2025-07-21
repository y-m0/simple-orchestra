// API types and interfaces for Simple Orchestra

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Workflow related types
export interface WorkflowStep {
  id: string;
  name: string;
  type: 'agent' | 'tool' | 'human' | 'condition';
  config: Record<string, unknown>;
  position: { x: number; y: number };
  inputs: WorkflowConnection[];
  outputs: WorkflowConnection[];
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  type: 'data' | 'control';
  config?: Record<string, unknown>;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  version: string;
  steps: WorkflowStep[];
  connections: WorkflowConnection[];
  metadata: {
    created_at: string;
    updated_at: string;
    created_by: string;
    tags?: string[];
  };
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: string;
  completed_at?: string;
  error?: string;
  inputs: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  steps: WorkflowStepExecution[];
}

export interface WorkflowStepExecution {
  id: string;
  step_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  started_at?: string;
  completed_at?: string;
  error?: string;
  inputs: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  logs: LogEntry[];
}

// Agent related types
export interface AgentDefinition {
  id: string;
  name: string;
  description?: string;
  type: 'llm' | 'tool' | 'human' | 'custom';
  config: AgentConfig;
  capabilities: string[];
  status: 'active' | 'inactive' | 'error';
  metadata: {
    created_at: string;
    updated_at: string;
    created_by: string;
    version: string;
  };
}

export interface AgentConfig {
  provider?: string;
  model?: string;
  parameters?: Record<string, unknown>;
  tools?: string[];
  memory_size?: number;
  timeout?: number;
}

export interface AgentExecution {
  id: string;
  agent_id: string;
  workflow_execution_id?: string;
  status: 'idle' | 'busy' | 'error' | 'offline';
  current_task?: string;
  metrics: {
    tasks_completed: number;
    average_response_time: number;
    success_rate: number;
    last_active: string;
  };
}

// Project related types
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'archived' | 'draft';
  workflows: string[]; // workflow IDs
  agents: string[]; // agent IDs
  metadata: {
    created_at: string;
    updated_at: string;
    created_by: string;
    collaborators?: string[];
    tags?: string[];
  };
  settings: ProjectSettings;
}

export interface ProjectSettings {
  auto_save: boolean;
  notifications: boolean;
  retention_days: number;
  access_level: 'private' | 'team' | 'public';
}

// Activity and logging types
export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  context?: Record<string, unknown>;
  source: string;
}

export interface ActivityEvent {
  id: string;
  type: 'workflow_started' | 'workflow_completed' | 'agent_deployed' | 'project_created' | 'user_action';
  timestamp: string;
  user_id: string;
  resource_type: 'workflow' | 'agent' | 'project';
  resource_id: string;
  action: string;
  details?: Record<string, unknown>;
}

// Data connection types
export interface DataConnection {
  id: string;
  name: string;
  type: 'database' | 'api' | 'file' | 'webhook';
  config: DataConnectionConfig;
  status: 'connected' | 'disconnected' | 'error';
  metadata: {
    created_at: string;
    updated_at: string;
    created_by: string;
  };
}

export interface DataConnectionConfig {
  url?: string;
  credentials?: Record<string, string>;
  headers?: Record<string, string>;
  schema?: DataSchema;
  refresh_interval?: number;
}

export interface DataSchema {
  tables?: TableSchema[];
  fields?: FieldSchema[];
}

export interface TableSchema {
  name: string;
  fields: FieldSchema[];
}

export interface FieldSchema {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  required: boolean;
  description?: string;
}

// Search and filter types
export interface SearchParams {
  query?: string;
  filters?: SearchFilter[];
  sort?: SortOption;
  pagination?: PaginationParams;
}

export interface SearchFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains' | 'startswith' | 'endswith';
  value: unknown;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// WebSocket event types
export interface WebSocketEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: string;
  id: string;
}

export interface WorkflowUpdateEvent {
  workflow_execution_id: string;
  status: WorkflowExecution['status'];
  step_updates?: WorkflowStepExecution[];
  completion_percentage?: number;
}