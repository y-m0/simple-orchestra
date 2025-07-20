
import { useEffect, useState } from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AgentTool } from '@/types/tool';
import { Check } from 'lucide-react';

interface ToolConfigModalProps {
  tool: AgentTool;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (id: string, config: Record<string, any>) => void;
}

export function ToolConfigModal({ 
  tool, 
  isOpen, 
  onClose, 
  onSaveConfig 
}: ToolConfigModalProps) {
  const [config, setConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    // Initialize config with current values
    if (tool.configSchema) {
      setConfig(tool.configSchema);
    }
  }, [tool]);

  const handleUpdateConfig = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSaveConfig(tool.id, config);
    onClose();
  };

  // Determine the type of configuration field
  const getFieldType = (key: string, value: any): string => {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    return 'string';
  };

  // Render configuration fields based on their types
  const renderConfigField = (key: string, value: any) => {
    const fieldType = getFieldType(key, value);

    switch (fieldType) {
      case 'boolean':
        return (
          <div key={key} className="flex items-center justify-between py-2">
            <Label htmlFor={key} className="w-full">{formatLabel(key)}</Label>
            <Switch 
              id={key} 
              checked={!!value} 
              onCheckedChange={val => handleUpdateConfig(key, val)}
            />
          </div>
        );
      case 'number':
        return (
          <div key={key} className="space-y-2 py-2">
            <Label htmlFor={key}>{formatLabel(key)}</Label>
            <Input 
              id={key} 
              type="number" 
              value={value}
              onChange={e => handleUpdateConfig(key, Number(e.target.value))} 
            />
          </div>
        );
      case 'array':
        return (
          <div key={key} className="space-y-2 py-2">
            <Label htmlFor={key}>{formatLabel(key)}</Label>
            <Input 
              id={key} 
              value={Array.isArray(value) ? value.join(', ') : ''} 
              onChange={e => handleUpdateConfig(key, e.target.value.split(',').map(item => item.trim()))}
              placeholder="Comma-separated values"
            />
            <p className="text-xs text-muted-foreground">Enter comma-separated values</p>
          </div>
        );
      case 'object':
        return (
          <div key={key} className="space-y-2 py-2">
            <Label htmlFor={key}>{formatLabel(key)}</Label>
            <Input 
              id={key} 
              value={JSON.stringify(value)} 
              onChange={e => {
                try {
                  handleUpdateConfig(key, JSON.parse(e.target.value));
                } catch (err) {
                  // Handle invalid JSON
                }
              }}
              placeholder="JSON object"
            />
            <p className="text-xs text-muted-foreground">Enter valid JSON</p>
          </div>
        );
      default:
        return (
          <div key={key} className="space-y-2 py-2">
            <Label htmlFor={key}>{formatLabel(key)}</Label>
            <Input 
              id={key} 
              value={value || ''} 
              onChange={e => handleUpdateConfig(key, e.target.value)} 
            />
          </div>
        );
    }
  };

  // Format config key as readable label
  const formatLabel = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/([A-Z])\s/g, '$1');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure {tool.name}</DialogTitle>
          <DialogDescription>
            Adjust settings for this tool to customize its behavior.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {tool.configSchema && Object.entries(config).map(([key, value]) => 
            renderConfigField(key, value)
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            Save Config
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
