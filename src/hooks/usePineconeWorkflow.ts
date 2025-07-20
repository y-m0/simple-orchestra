
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Workflow } from '@/types/workflow';
import pineconeClient from '@/lib/pinecone';

export const usePineconeWorkflow = () => {
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

  // Index a workflow in Pinecone
  const indexWorkflow = useCallback(async (workflow: Workflow) => {
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
      const result = await pineconeClient.indexWorkflow(workflow);
      toast({
        title: "Workflow Indexed",
        description: `Workflow "${workflow.title}" has been indexed in Pinecone.`,
      });
      return result;
    } catch (error) {
      console.error('Failed to index workflow:', error);
      toast({
        variant: "destructive",
        title: "Indexing Failed",
        description: "Could not index workflow in Pinecone.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, toast]);

  // Find similar workflows
  const findSimilarWorkflows = useCallback(async (query: string, limit: number = 5) => {
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
      const result = await pineconeClient.querySimilarWorkflows(query, limit);
      return result.matches;
    } catch (error) {
      console.error('Failed to query similar workflows:', error);
      toast({
        variant: "destructive",
        title: "Query Failed",
        description: "Could not find similar workflows in Pinecone.",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, toast]);

  // Delete workflow from index
  const deleteWorkflowFromIndex = useCallback(async (workflowId: string) => {
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
      await pineconeClient.deleteVector(workflowId);
      toast({
        title: "Workflow Removed",
        description: "Workflow has been removed from Pinecone index.",
      });
      return true;
    } catch (error) {
      console.error('Failed to delete workflow from index:', error);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "Could not remove workflow from Pinecone index.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isInitialized, toast]);

  return {
    isInitialized,
    isLoading,
    indexWorkflow,
    findSimilarWorkflows,
    deleteWorkflowFromIndex,
  };
};
