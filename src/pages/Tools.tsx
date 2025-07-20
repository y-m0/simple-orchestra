
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, Plus, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolTestModal } from '@/components/tools/ToolTestModal';
import { ToolConfigModal } from '@/components/tools/ToolConfigModal';
import { AgentTool } from '@/types/tool';
import { useToolRegistry } from '@/lib/tools/registry';
import { useToast } from '@/hooks/use-toast';

export default function Tools() {
  const [tools, setTools] = useState<AgentTool[]>([]);
  const [filteredTools, setFilteredTools] = useState<AgentTool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedTool, setSelectedTool] = useState<AgentTool | null>(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  
  const toolRegistry = useToolRegistry();
  const { toast } = useToast();

  // Load tools on initial render
  useEffect(() => {
    const allTools = toolRegistry.getAllTools();
    setTools(allTools);
    setFilteredTools(allTools);
  }, []);

  // Filter tools when search query or tab changes
  useEffect(() => {
    let filtered = [...tools];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(query) || 
        tool.description.toLowerCase().includes(query)
      );
    }
    
    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(tool => 
        activeTab === 'enabled' ? tool.enabled : tool.category === activeTab
      );
    }
    
    setFilteredTools(filtered);
  }, [searchQuery, activeTab, tools]);

  const handleToggleTool = (id: string, enabled: boolean) => {
    if (enabled) {
      toolRegistry.enableTool(id);
    } else {
      toolRegistry.disableTool(id);
    }
    
    // Update the tools state
    const updatedTools = tools.map(tool => 
      tool.id === id ? { ...tool, enabled } : tool
    );
    
    setTools(updatedTools);
    
    toast({
      title: enabled ? "Tool Enabled" : "Tool Disabled",
      description: `${tools.find(t => t.id === id)?.name} has been ${enabled ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleConfigureTool = (id: string) => {
    const tool = tools.find(t => t.id === id);
    if (tool) {
      setSelectedTool(tool);
      setIsConfigModalOpen(true);
    }
  };

  const handleTestTool = (id: string) => {
    const tool = tools.find(t => t.id === id);
    if (tool) {
      setSelectedTool(tool);
      setIsTestModalOpen(true);
    }
  };

  const handleSaveConfig = (id: string, config: Record<string, any>) => {
    toolRegistry.configureToolSettings(id, config);
    
    // Update the tools state
    const updatedTools = tools.map(tool => 
      tool.id === id ? { ...tool, configSchema: { ...config } } : tool
    );
    
    setTools(updatedTools);
    
    toast({
      title: "Tool Configuration Saved",
      description: `Settings for ${tools.find(t => t.id === id)?.name} have been updated.`,
    });
  };

  // Get unique tool categories for tabs
  const categories: string[] = ['all', 'enabled', ...new Set(tools.map(tool => tool.category))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Agent Tools</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Manage and configure tools that agents can use in workflows</span>
          </div>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Register Tool
        </Button>
      </div>
      
      <Card className="p-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between mb-4 flex-col sm:flex-row gap-4">
            <TabsList>
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="flex gap-2">
              <div className="relative">
                <Input
                  placeholder="Search tools..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value={activeTab} className="mt-6">
            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.map((tool) => (
                  <ToolCard 
                    key={tool.id} 
                    tool={tool}
                    onToggle={handleToggleTool}
                    onConfigure={handleConfigureTool}
                    onTest={handleTestTool}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">No tools found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? "Try adjusting your search criteria" 
                    : "Get started by registering tools for your agents"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Test Modal */}
      {selectedTool && (
        <ToolTestModal 
          tool={selectedTool}
          isOpen={isTestModalOpen}
          onClose={() => {
            setIsTestModalOpen(false);
            setSelectedTool(null);
          }}
        />
      )}
      
      {/* Config Modal */}
      {selectedTool && (
        <ToolConfigModal 
          tool={selectedTool}
          isOpen={isConfigModalOpen}
          onClose={() => {
            setIsConfigModalOpen(false);
            setSelectedTool(null);
          }}
          onSaveConfig={handleSaveConfig}
        />
      )}
    </div>
  );
}
