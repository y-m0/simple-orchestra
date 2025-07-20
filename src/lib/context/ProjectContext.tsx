
import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { usePineconeProject } from '@/hooks/usePineconeProject';
import type { Project, Goal } from '@/types/project';

// Define the ProjectContextType directly here instead of importing from conflicting files
export interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  createProject: (project: Omit<Project, 'id' | 'goals'>) => Project;
  updateProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  addGoal: (projectId: string, goal: Omit<Goal, 'id' | 'projectId'>) => Goal;
  updateGoal: (projectId: string, goal: Goal) => void;
  deleteGoal: (projectId: string, goalId: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Add Pinecone integration
  const { 
    indexProject, 
    indexGoal,
    deleteProjectFromIndex,
    deleteGoalFromIndex
  } = usePineconeProject();

  const createProject = useCallback((project: Omit<Project, 'id' | 'goals'>): Project => {
    const newProject: Project = {
      ...project,
      id: uuidv4(),
      goals: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Ensure owner is present as required by the Project type in types/project.ts
      owner: project.owner || 'default-owner',
      // Ensure other required fields from types/project.ts are present
      collaborators: project.collaborators || [],
      tags: project.tags || [],
      status: project.status || 'active',
    };
    setProjects(prev => [...prev, newProject]);
    
    // Index project in Pinecone
    indexProject(newProject).catch(error => 
      console.error(`Failed to index project in Pinecone: ${error}`)
    );
    
    return newProject;
  }, [indexProject]);

  const updateProject = useCallback((project: Project) => {
    setProjects(prev => prev.map(p => p.id === project.id ? project : p));
    
    // Update project in Pinecone
    indexProject(project).catch(error => 
      console.error(`Failed to update project in Pinecone: ${error}`)
    );
  }, [indexProject]);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
    
    // Remove project from Pinecone
    deleteProjectFromIndex(projectId).catch(error => 
      console.error(`Failed to remove project from Pinecone: ${error}`)
    );
  }, [selectedProject, deleteProjectFromIndex]);

  const addGoal = useCallback((projectId: string, goal: Omit<Goal, 'id' | 'projectId'>): Goal => {
    const newGoal: Goal = {
      ...goal,
      id: uuidv4(),
      projectId, // Add projectId as required by the Goal type in types/project.ts
      createdAt: new Date().toISOString(),
      // Ensure other required fields are present
      status: goal.status || 'pending',
      priority: goal.priority || 'medium',
      description: goal.description || '',
      title: goal.title || '',
    };
    
    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, goals: [...p.goals, newGoal] }
        : p
    ));
    
    // Index goal in Pinecone
    indexGoal(newGoal).catch(error => 
      console.error(`Failed to index goal in Pinecone: ${error}`)
    );
    
    return newGoal;
  }, [indexGoal]);

  const updateGoal = useCallback((projectId: string, goal: Goal) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId
        ? { ...p, goals: p.goals.map(g => g.id === goal.id ? goal : g) }
        : p
    ));
    
    // Update goal in Pinecone
    indexGoal(goal).catch(error => 
      console.error(`Failed to update goal in Pinecone: ${error}`)
    );
  }, [indexGoal]);

  const deleteGoal = useCallback((projectId: string, goalId: string) => {
    setProjects(prev => prev.map(p => 
      p.id === projectId
        ? { ...p, goals: p.goals.filter(g => g.id !== goalId) }
        : p
    ));
    
    // Remove goal from Pinecone
    deleteGoalFromIndex(goalId).catch(error => 
      console.error(`Failed to remove goal from Pinecone: ${error}`)
    );
  }, [deleteGoalFromIndex]);

  return (
    <ProjectContext.Provider value={{
      projects,
      selectedProject,
      setSelectedProject,
      createProject,
      updateProject,
      deleteProject,
      addGoal,
      updateGoal,
      deleteGoal,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
