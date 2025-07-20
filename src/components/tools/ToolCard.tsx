
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AgentTool } from '@/types/tool';
import { Settings, Play, Wrench } from 'lucide-react';

interface ToolCardProps {
  tool: AgentTool;
  onToggle: (id: string, enabled: boolean) => void;
  onConfigure: (id: string) => void;
  onTest: (id: string) => void;
}

export function ToolCard({ tool, onToggle, onConfigure, onTest }: ToolCardProps) {
  const [enabled, setEnabled] = useState(tool.enabled);

  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    onToggle(tool.id, newState);
  };

  return (
    <Card className={enabled ? '' : 'opacity-70'}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Wrench className="h-4 w-4" />
            </div>
            <CardTitle>{tool.name}</CardTitle>
          </div>
          <Switch 
            checked={enabled} 
            onCheckedChange={handleToggle} 
            aria-label="Toggle tool" 
          />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{tool.description}</p>
        <div className="mt-3">
          <Badge>{tool.category}</Badge>
          {tool.requiresConfig && (
            <Badge variant="outline" className="ml-2">Requires Config</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-3">
        {tool.requiresConfig && (
          <Button variant="outline" size="sm" onClick={() => onConfigure(tool.id)}>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        )}
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => onTest(tool.id)} 
          disabled={!enabled}
        >
          <Play className="h-4 w-4 mr-2" />
          Test Run
        </Button>
      </CardFooter>
    </Card>
  );
}
