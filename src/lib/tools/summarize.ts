
import { AgentTool, ToolResult } from '@/types/tool';
import { logToConsole, safeRun } from '@/lib/utils';

export function getSummarizer(): AgentTool {
  return {
    id: 'text-summarizer',
    name: 'Text Summarizer',
    description: 'Summarize long text into key points',
    category: 'analysis',
    enabled: true,
    requiresConfig: false,
    run: async (text: string, context?: any): Promise<ToolResult> => {
      logToConsole(`Summarizing text: ${text.substring(0, 50)}...`, 'info', { tool: 'text-summarizer' });
      
      // This would use an LLM API in production
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      return safeRun(async () => {
        // Generate a simple mock summary by taking the first sentence
        // and adding a fabricated conclusion
        const firstSentence = text.split('.')[0];
        const summary = `${firstSentence}. This text discusses key concepts and provides important information.`;
        
        return {
          success: true,
          result: summary,
          metadata: {
            originalLength: text.length,
            summaryLength: summary.length,
            compressionRatio: summary.length / text.length
          }
        } as ToolResult;
      }, {
        success: true,
        result: '',
        error: 'Failed to summarize the text'
      } as ToolResult);
    }
  };
}
