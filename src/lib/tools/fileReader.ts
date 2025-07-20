
import { AgentTool, ToolResult } from '@/types/tool';
import { logToConsole, safeRun } from '@/lib/utils';

export function getFileReader(): AgentTool {
  return {
    id: 'file-reader',
    name: 'File Reader',
    description: 'Read and extract content from files',
    category: 'data',
    enabled: true,
    requiresConfig: true,
    configSchema: {
      supportedFormats: ['txt', 'pdf', 'docx', 'csv', 'json'],
      maxFileSizeMb: 10
    },
    run: async (filePath: string, context?: any): Promise<ToolResult> => {
      logToConsole(`Reading file: ${filePath}`, 'info', { tool: 'file-reader' });
      
      // This would actually read a file in production
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate file processing
      
      return safeRun(async () => {
        const fileExtension = filePath.split('.').pop()?.toLowerCase();
        
        if (!fileExtension) {
          return {
            success: false,
            result: '',
            error: 'Invalid file path, missing extension'
          };
        }
        
        // Check if format is supported
        const supportedFormats = ['txt', 'pdf', 'docx', 'csv', 'json'];
        if (!supportedFormats.includes(fileExtension)) {
          return {
            success: false,
            result: '',
            error: `Unsupported file format: ${fileExtension}`
          };
        }
        
        // Mock file content based on extension
        let content = '';
        switch (fileExtension) {
          case 'txt':
            content = 'This is sample text file content.';
            break;
          case 'pdf':
            content = 'Extracted PDF content would appear here.';
            break;
          case 'docx':
            content = 'Extracted DOCX content would appear here.';
            break;
          case 'csv':
            content = 'id,name,value\n1,item1,100\n2,item2,200';
            break;
          case 'json':
            content = '{"items": [{"id": 1, "name": "item1"}, {"id": 2, "name": "item2"}]}';
            break;
        }
        
        return {
          success: true,
          result: content,
          metadata: {
            filePath,
            fileType: fileExtension,
            size: content.length
          }
        };
      }, {
        success: false,
        result: '',
        error: `Failed to read file: ${filePath}`
      });
    }
  };
}
