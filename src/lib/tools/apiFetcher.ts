
import { AgentTool, ToolResult } from '@/types/tool';
import { logToConsole, safeRun, retryAsync } from '@/lib/utils';

export function getApiFetcher(): AgentTool {
  return {
    id: 'api-fetcher',
    name: 'API Fetcher',
    description: 'Fetch data from APIs',
    category: 'data',
    enabled: true,
    requiresConfig: true,
    configSchema: {
      headers: {},
      timeout: 5000,
      maxRetries: 3
    },
    run: async (endpoint: string, context?: any): Promise<ToolResult> => {
      logToConsole(`Fetching API: ${endpoint}`, 'info', { tool: 'api-fetcher' });
      
      // Parse JSON context if provided
      let body = undefined;
      let method = 'GET';
      
      if (context) {
        method = context.method || 'GET';
        body = context.body;
      }
      
      // In a real implementation, this would make an actual API call
      return await retryAsync(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        return safeRun(async () => {
          // Mock successful API response
          const mockResponse = {
            status: 200,
            data: { 
              message: "Success", 
              endpoint,
              timestamp: new Date().toISOString(),
              requestMethod: method
            }
          };
          
          return {
            success: true,
            result: JSON.stringify(mockResponse),
            metadata: {
              endpoint,
              method,
              responseTime: 1000
            }
          } as ToolResult;
        }, {
          success: true,
          result: '',
          error: `Failed to fetch API: ${endpoint}`
        } as ToolResult);
      }, 3);
    }
  };
}
