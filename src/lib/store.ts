
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Activity {
  id: string;
  type: 'workflow' | 'workflow_loaded' | 'workflow_created' | 'workflow_started' | 'workflow_stopped' | 'task_approved' | 'task_rejected';
  status: 'completed' | 'error' | 'running' | 'pending' | 'success';
  workflowId: string;
  workflowName?: string;
  timestamp: string;
  details: string | {
    steps?: number;
    duration?: number;
    error?: string;
    [key: string]: any;
  };
}

interface AppState {
  // Workflow state
  workflows: any[]
  selectedWorkflow: string | null
  // Agent state
  agents: any[]
  selectedAgent: string | null
  // Activity state
  activities: Activity[]
  // Settings state
  settings: {
    theme: 'light' | 'dark'
    notifications: boolean
    autoSave: boolean
    dashboardRefreshInterval: number
  }
  // Actions
  setWorkflows: (workflows: any[]) => void
  setSelectedWorkflow: (id: string | null) => void
  setAgents: (agents: any[]) => void
  setSelectedAgent: (id: string | null) => void
  setActivities: (activities: Activity[] | ((prev: Activity[]) => Activity[])) => void
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void
  updateSettings: (settings: Partial<AppState['settings']>) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      workflows: [],
      selectedWorkflow: null,
      agents: [],
      selectedAgent: null,
      activities: [],
      settings: {
        theme: 'light',
        notifications: true,
        autoSave: true,
        dashboardRefreshInterval: 30, // seconds
      },
      setWorkflows: (workflows: any[]) => set({ workflows }),
      setSelectedWorkflow: (id: string | null) => set({ selectedWorkflow: id }),
      setAgents: (agents: any[]) => set({ agents }),
      setSelectedAgent: (id: string | null) => set({ selectedAgent: id }),
      setActivities: (activities: Activity[] | ((prev: Activity[]) => Activity[])) => set((state: any) => ({
        activities: typeof activities === 'function' ? activities(state.activities) : activities
      })),
      addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => set((state: any) => {
        const newActivity = {
          ...activity,
          id: `activity-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          timestamp: new Date().toISOString()
        };
        
        // Log to console for ActivityTimeline to pick up
        const activityType = activity.type.replace(/_/g, ' ');
        console.log(`Activity Log: ${activityType} - ${activity.details}`);
        
        return {
          activities: [newActivity, ...state.activities].slice(0, 100) // Keep last 100 activities
        };
      }),
      updateSettings: (settings: Partial<AppState['settings']>) => 
        set((state: any) => ({ settings: { ...state.settings, ...settings } })),
    }),
    {
      name: 'orchestration-nexus-storage',
    }
  )
)
