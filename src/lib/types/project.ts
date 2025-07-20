export interface Goal {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  goals: Goal[];
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  createProject: (project: Omit<Project, 'id' | 'goals'>) => Project;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addGoal: (projectId: string, goal: Omit<Goal, 'id'>) => Goal;
  updateGoal: (projectId: string, goal: Goal) => void;
  deleteGoal: (projectId: string, goalId: string) => void;
} 