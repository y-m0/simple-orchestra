
import { AgentTool, ToolRegistry } from '@/types/tool';
import { getWebSearch } from './webSearch';
import { getSummarizer } from './summarize';
import { getFileReader } from './fileReader';
import { getApiFetcher } from './apiFetcher';

// Initialize with default tools
const initialTools: AgentTool[] = [
  getWebSearch(),
  getSummarizer(),
  getFileReader(),
  getApiFetcher()
];

class ToolRegistryImpl implements ToolRegistry {
  private tools: Map<string, AgentTool> = new Map();
  
  constructor(initialTools: AgentTool[]) {
    initialTools.forEach(tool => this.registerTool(tool));
  }
  
  getAllTools(): AgentTool[] {
    return Array.from(this.tools.values());
  }
  
  getEnabledTools(): AgentTool[] {
    return Array.from(this.tools.values()).filter(tool => tool.enabled);
  }
  
  getTool(id: string): AgentTool | undefined {
    return this.tools.get(id);
  }
  
  registerTool(tool: AgentTool): void {
    if (this.tools.has(tool.id)) {
      console.warn(`Tool with ID ${tool.id} already registered. Overwriting.`);
    }
    this.tools.set(tool.id, tool);
  }
  
  enableTool(id: string): void {
    const tool = this.tools.get(id);
    if (tool) {
      this.tools.set(id, { ...tool, enabled: true });
    }
  }
  
  disableTool(id: string): void {
    const tool = this.tools.get(id);
    if (tool) {
      this.tools.set(id, { ...tool, enabled: false });
    }
  }
  
  configureToolSettings(id: string, settings: Record<string, any>): void {
    const tool = this.tools.get(id);
    if (tool) {
      // Store settings in the tool config
      this.tools.set(id, { 
        ...tool,
        configSchema: {
          ...tool.configSchema,
          ...settings
        }
      });
    }
  }
}

// Create and export a singleton instance
export const toolRegistry: ToolRegistry = new ToolRegistryImpl(initialTools);

// Hook for accessing the tool registry
export function useToolRegistry(): ToolRegistry {
  return toolRegistry;
}
