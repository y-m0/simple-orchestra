
import { Project, Goal } from '@/types/project';

export const initialProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'Enterprise Knowledge Base',
    description: 'Build an AI-powered knowledge base to centralize company information',
    createdAt: '2023-04-10T08:00:00Z',
    updatedAt: '2023-04-15T14:30:00Z',
    status: 'active',
    owner: 'Alice Johnson',
    collaborators: ['Bob Smith', 'Carol Taylor'],
    tags: ['knowledge-management', 'ai'],
    goals: [
      {
        id: 'goal-001',
        projectId: 'proj-001',
        title: 'Define knowledge categories',
        description: 'Identify and categorize types of knowledge to be stored',
        status: 'completed',
        priority: 'high',
        createdAt: '2023-04-10T09:00:00Z',
        workflowId: undefined,
        tags: ['planning']
      },
      {
        id: 'goal-002',
        projectId: 'proj-001',
        title: 'Create document analyzer',
        description: 'Build workflow to analyze and index uploaded documents',
        status: 'in-progress',
        priority: 'high',
        createdAt: '2023-04-11T10:00:00Z',
        workflowId: 'workflow-001',
        tags: ['integration']
      },
      {
        id: 'goal-003',
        projectId: 'proj-001',
        title: 'Implement search functionality',
        description: 'Develop semantic search for knowledge retrieval',
        status: 'pending',
        priority: 'medium',
        createdAt: '2023-04-12T11:00:00Z',
        tags: ['search']
      }
    ]
  },
  {
    id: 'proj-002',
    name: 'Customer Support Automation',
    description: 'Automate customer support inquiries using AI agents',
    createdAt: '2023-04-05T09:15:00Z',
    updatedAt: '2023-04-18T16:45:00Z',
    status: 'active',
    owner: 'Dave Wilson',
    collaborators: ['Eve Brown'],
    tags: ['customer-support', 'automation'],
    goals: [
      {
        id: 'goal-004',
        projectId: 'proj-002',
        title: 'Analyze common support tickets',
        description: 'Identify patterns in customer inquiries',
        status: 'completed',
        priority: 'high',
        createdAt: '2023-04-05T10:00:00Z',
        tags: ['analysis']
      },
      {
        id: 'goal-005',
        projectId: 'proj-002',
        title: 'Create ticket classifier workflow',
        description: 'Build workflow to classify and route incoming tickets',
        status: 'in-progress',
        priority: 'high',
        createdAt: '2023-04-06T11:30:00Z',
        workflowId: 'workflow-002',
        tags: ['classification']
      },
      {
        id: 'goal-006',
        projectId: 'proj-002',
        title: 'Implement automated responses',
        description: 'Create workflows for generating responses to common issues',
        status: 'pending',
        priority: 'medium',
        createdAt: '2023-04-07T09:45:00Z',
        tags: ['automation']
      }
    ]
  }
];

// Mock database functions
let projects = [...initialProjects];

export const getProjects = () => [...projects];

export const getProject = (id: string) => {
  return projects.find(project => project.id === id);
};

export const getProjectWithCompletion = (id: string) => {
  const project = getProject(id);
  if (!project) return undefined;
  
  const totalGoals = project.goals.length;
  const completedGoals = project.goals.filter(g => g.status === 'completed').length;
  const completionPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  
  return {
    ...project,
    completionPercentage
  };
};

export const createProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newProject: Project = {
    ...project,
    id: `proj-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  projects.push(newProject);
  return newProject;
};

export const updateProject = (project: Project) => {
  const index = projects.findIndex(p => p.id === project.id);
  if (index !== -1) {
    projects[index] = {
      ...project,
      updatedAt: new Date().toISOString()
    };
    return projects[index];
  }
  return null;
};

export const createGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
  const project = projects.find(p => p.id === goal.projectId);
  if (!project) return null;
  
  const newGoal: Goal = {
    ...goal,
    id: `goal-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString()
  };
  
  project.goals.push(newGoal);
  project.updatedAt = new Date().toISOString();
  
  return newGoal;
};

export const updateGoal = (updatedGoal: Goal) => {
  const project = projects.find(p => p.id === updatedGoal.projectId);
  if (!project) return null;
  
  const goalIndex = project.goals.findIndex(g => g.id === updatedGoal.id);
  if (goalIndex !== -1) {
    project.goals[goalIndex] = updatedGoal;
    project.updatedAt = new Date().toISOString();
    return updatedGoal;
  }
  
  return null;
};

export const deleteGoal = (projectId: string, goalId: string) => {
  const project = projects.find(p => p.id === projectId);
  if (!project) return false;
  
  const initialLength = project.goals.length;
  project.goals = project.goals.filter(g => g.id !== goalId);
  project.updatedAt = new Date().toISOString();
  
  return project.goals.length < initialLength;
};

export const linkGoalToWorkflow = (goalId: string, workflowId: string) => {
  for (const project of projects) {
    const goal = project.goals.find(g => g.id === goalId);
    if (goal) {
      goal.workflowId = workflowId;
      goal.status = 'in-progress';
      project.updatedAt = new Date().toISOString();
      return true;
    }
  }
  return false;
};
