import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Data connection interfaces
export interface PostgreSQLConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password?: string;
  ssl?: boolean;
  createdAt: string;
}

export interface S3Connection {
  id: string;
  name: string;
  accessKeyId: string;
  secretAccessKey?: string;
  region: string;
  bucket: string;
  prefix?: string;
  createdAt: string;
}

export interface PineconeConnection {
  id: string;
  name: string;
  apiKey?: string;
  environment: string;
  indexName: string;
  dimension?: number;
  metric?: 'cosine' | 'euclidean' | 'dotproduct';
  createdAt: string;
}

// LLM execution data interfaces
export interface LLMExecutionInput {
  prompt?: string;
  messages?: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  context?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
}

export interface LLMExecutionOutput {
  text?: string;
  tokens?: {
    input: number;
    output: number;
    total: number;
  };
  finishReason?: 'stop' | 'length' | 'content_filter';
  metadata?: Record<string, unknown>;
}

// Workflow node configuration interface
export interface WorkflowNodeConfig {
  // LLM node configuration
  model?: string;
  temperature?: number;
  maxTokens?: number;
  prompt?: string;
  // Human node configuration
  assignee?: string;
  deadline?: string;
  instructions?: string;
  // Logic node configuration
  condition?: string;
  variables?: Record<string, unknown>;
  // Data node configuration
  connectionId?: string;
  query?: string;
  operation?: 'read' | 'write' | 'update' | 'delete';
  // Generic properties for extensibility
  [key: string]: unknown;
}

export interface LLMNode {
  id: string;
  type: 'openai' | 'huggingface';
  name: string;
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
    apiKey?: string;
  };
  status: 'idle' | 'running' | 'error' | 'success';
  lastExecution?: {
    timestamp: string;
    input: LLMExecutionInput;
    output: LLMExecutionOutput;
    duration: number;
  };
}

export interface WorkflowNode {
  id: string;
  type: 'llm' | 'human' | 'logic' | 'data';
  position: { x: number; y: number };
  data: {
    label: string;
    config: WorkflowNodeConfig;
  };
  inputs: string[];
  outputs: string[];
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  data: {
    label?: string;
    type: 'data' | 'control';
  };
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'archived';
  lastRun?: {
    timestamp: string;
    status: 'success' | 'error' | 'running';
    duration?: number;
  };
}

interface WorkflowState {
  // Workflow state
  workflows: Workflow[];
  selectedWorkflow: string | null;
  // LLM nodes state
  llmNodes: LLMNode[];
  // Data connections
  dataConnections: {
    postgresql: PostgreSQLConnection[];
    s3: S3Connection[];
    pinecone: PineconeConnection[];
  };
  // Actions
  setWorkflows: (workflows: Workflow[]) => void;
  setSelectedWorkflow: (id: string | null) => void;
  addWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  // LLM node actions
  setLLMNodes: (nodes: LLMNode[]) => void;
  addLLMNode: (node: Omit<LLMNode, 'id'>) => void;
  updateLLMNode: (id: string, updates: Partial<LLMNode>) => void;
  // Data connection actions
  setDataConnections: (connections: WorkflowState['dataConnections']) => void;
  addDataConnection: (type: keyof WorkflowState['dataConnections'], connection: PostgreSQLConnection | S3Connection | PineconeConnection) => void;
  removeDataConnection: (type: keyof WorkflowState['dataConnections'], id: string) => void;
}

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set: any) => ({
      workflows: [],
      selectedWorkflow: null,
      llmNodes: [],
      dataConnections: {
        postgresql: [],
        s3: [],
        pinecone: [],
      },
      setWorkflows: (workflows: Workflow[]) => set({ workflows }),
      setSelectedWorkflow: (id: string | null) => set({ selectedWorkflow: id }),
      addWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => set((state: WorkflowState) => ({
        workflows: [
          {
            ...workflow,
            id: `workflow-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...state.workflows,
        ],
      })),
      updateWorkflow: (id: string, updates: Partial<Workflow>) => set((state: WorkflowState) => ({
        workflows: state.workflows.map((workflow: Workflow) =>
          workflow.id === id
            ? {
                ...workflow,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : workflow
        ),
      })),
      deleteWorkflow: (id: string) => set((state: WorkflowState) => ({
        workflows: state.workflows.filter((workflow: Workflow) => workflow.id !== id),
      })),
      setLLMNodes: (nodes: LLMNode[]) => set({ llmNodes: nodes }),
      addLLMNode: (node: Omit<LLMNode, 'id'>) => set((state: WorkflowState) => ({
        llmNodes: [
          {
            ...node,
            id: `llm-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          },
          ...state.llmNodes,
        ],
      })),
      updateLLMNode: (id: string, updates: Partial<LLMNode>) => set((state: WorkflowState) => ({
        llmNodes: state.llmNodes.map((node: LLMNode) =>
          node.id === id ? { ...node, ...updates } : node
        ),
      })),
      setDataConnections: (connections: WorkflowState['dataConnections']) => set({ dataConnections: connections }),
      addDataConnection: (type: keyof WorkflowState['dataConnections'], connection: PostgreSQLConnection | S3Connection | PineconeConnection) => set((state: WorkflowState) => ({
        dataConnections: {
          ...state.dataConnections,
          [type]: [
            {
              ...connection,
              id: `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            },
            ...state.dataConnections[type],
          ],
        },
      })),
      removeDataConnection: (type: keyof WorkflowState['dataConnections'], id: string) => set((state: WorkflowState) => ({
        dataConnections: {
          ...state.dataConnections,
          [type]: state.dataConnections[type].filter(
            (connection: any) => connection.id !== id
          ),
        },
      })),
    }),
    {
      name: 'orchestration-nexus-workflow-storage',
    }
  )
); 