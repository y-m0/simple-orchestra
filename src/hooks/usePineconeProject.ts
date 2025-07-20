
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Project, Goal } from '@/types/project';
import pineconeClient from '@/lib/pinecone';

export const usePineconeProject = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize Pinecone client
  useEffect(() => {
    const initPinecone = async () => {
      try {
        await pineconeClient.init();
        setIsInitialized(true);
        console.log('Pinecone client initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Pinecone client:', error);
        toast({
          variant: "destructive",
          title: "Pinecone Initialization Failed",
          description: "Could not connect to Pinecone. Some features may not work properly.",
        });
      }
    };

    initPinecone();
  }, [toast]);

  // Index a project in Pinecone
  const indexProject = useCallback(async (project: Project) => {
    if (!isInitialized) {
      toast({
        variant: "destructive",
        title: "Pinecone Not Ready",
        description: "Waiting for Pinecone to initialize. Please try again.",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const result = await pineconeClient.indexProject(project);
      toast({
        title: "Project Indexed",
        description: `Project "${project.name}" has been indexed in Pinecone.`,
      });
      return result;
    } catch (error) {
      console.error('Failed to index project:', error);
      toast({
        variant: "destructive",
        title: "Indexing Failed",
        description: "Could not index project in Pinecone.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, toast]);

  // Index a goal in Pinecone
  const indexGoal = useCallback(async (goal: Goal) => {
    if (!isInitialized) {
      toast({
        variant: "destructive",
        title: "Pinecone Not Ready",
        description: "Waiting for Pinecone to initialize. Please try again.",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const result = await pineconeClient.indexGoal(goal);
      toast({
        title: "Goal Indexed",
        description: `Goal "${goal.title}" has been indexed in Pinecone.`,
      });
      return result;
    } catch (error) {
      console.error('Failed to index goal:', error);
      toast({
        variant: "destructive",
        title: "Indexing Failed",
        description: "Could not index goal in Pinecone.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, toast]);

  // Find similar projects
  const findSimilarProjects = useCallback(async (query: string, limit: number = 5) => {
    if (!isInitialized) {
      toast({
        variant: "destructive",
        title: "Pinecone Not Ready",
        description: "Waiting for Pinecone to initialize. Please try again.",
      });
      return [];
    }

    setIsLoading(true);
    try {
      const result = await pineconeClient.querySimilarProjects(query, limit);
      return result.matches;
    } catch (error) {
      console.error('Failed to query similar projects:', error);
      toast({
        variant: "destructive",
        title: "Query Failed",
        description: "Could not find similar projects in Pinecone.",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, toast]);

  // Delete project from index
  const deleteProjectFromIndex = useCallback(async (projectId: string) => {
    if (!isInitialized) {
      toast({
        variant: "destructive",
        title: "Pinecone Not Ready",
        description: "Waiting for Pinecone to initialize. Please try again.",
      });
      return false;
    }

    setIsLoading(true);
    try {
      await pineconeClient.deleteVector(projectId);
      toast({
        title: "Project Removed",
        description: "Project has been removed from Pinecone index.",
      });
      return true;
    } catch (error) {
      console.error('Failed to delete project from index:', error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Could not remove project from Pinecone index.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, toast]);

  // Delete goal from index
  const deleteGoalFromIndex = useCallback(async (goalId: string) => {
    if (!isInitialized) {
      toast({
        variant: "destructive",
        title: "Pinecone Not Ready",
        description: "Waiting for Pinecone to initialize. Please try again.",
      });
      return false;
    }

    setIsLoading(true);
    try {
      await pineconeClient.deleteVector(goalId);
      toast({
        title: "Goal Removed",
        description: "Goal has been removed from Pinecone index.",
      });
      return true;
    } catch (error) {
      console.error('Failed to delete goal from index:', error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Could not remove goal from Pinecone index.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, toast]);

  return {
    isInitialized,
    isLoading,
    indexProject,
    indexGoal,
    findSimilarProjects,
    deleteProjectFromIndex,
    deleteGoalFromIndex,
  };
};
