
import { Workflow } from './workflow';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  goals: Goal[];
  status: 'active' | 'completed' | 'archived';
  owner: string;
  collaborators?: string[];
  tags?: string[];
}

export interface Goal {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  dueDate?: string;
  workflowId?: string; // Link to workflow if one exists
  parentGoalId?: string; // For nested goals/sub-goals
  tags?: string[];
}

export interface ProjectWithDetails extends Project {
  workflows?: Workflow[];
  completionPercentage: number;
}
