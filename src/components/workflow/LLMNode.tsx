import React from 'react';
import { LLMNode as LLMNodeType } from '../../lib/workflowStore';
import { useWorkflowStore } from '../../lib/workflowStore';
import { LLMExecutor } from '../../lib/llm';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';

interface LLMNodeProps {
  node: LLMNodeType;
  onDelete: () => void;
}

export const LLMNode: React.FC<LLMNodeProps> = ({ node, onDelete }) => {
  const updateLLMNode = useWorkflowStore((state) => state.updateLLMNode);
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  const handleConfigChange = (key: keyof LLMNodeType['config'], value: any) => {
    updateLLMNode(node.id, {
      config: {
        ...node.config,
        [key]: value,
      },
    });
  };

  const handleExecute = async () => {
    if (!input.trim()) return;

    setIsExecuting(true);
    updateLLMNode(node.id, { status: 'running' });

    try {
      const executor = LLMExecutor.getInstance();
      const result = await executor.execute(node, input);

      if (result.success) {
        setOutput(result.output);
        updateLLMNode(node.id, {
          status: 'success',
          lastExecution: {
            timestamp: new Date().toISOString(),
            input,
            output: result.output,
            duration: result.duration,
          },
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      updateLLMNode(node.id, { status: 'error' });
      setOutput(error instanceof Error ? error.message : 'Execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const getBadgeVariant = () => {
    switch (node.status) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {node.name}
        </CardTitle>
        <Badge variant={getBadgeVariant()}>
          {node.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Model</Label>
            <Select
              value={node.config.model}
              onValueChange={(value) => handleConfigChange('model', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {node.type === 'openai' ? (
                  <>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="gpt2">GPT-2</SelectItem>
                    <SelectItem value="t5-base">T5 Base</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Temperature</Label>
            <Slider
              value={[node.config.temperature]}
              onValueChange={([value]) => handleConfigChange('temperature', value)}
              min={0}
              max={1}
              step={0.1}
            />
          </div>

          <div className="space-y-2">
            <Label>Max Tokens</Label>
            <Input
              type="number"
              value={node.config.maxTokens}
              onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
              min={1}
              max={4000}
            />
          </div>

          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              type="password"
              value={node.config.apiKey || ''}
              onChange={(e) => handleConfigChange('apiKey', e.target.value)}
              placeholder="Enter API key"
            />
          </div>

          <div className="space-y-2">
            <Label>Input</Label>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input text"
            />
          </div>

          <Button
            onClick={handleExecute}
            disabled={isExecuting || !input.trim() || !node.config.apiKey}
            className="w-full"
          >
            {isExecuting ? 'Executing...' : 'Execute'}
          </Button>

          {output && (
            <div className="space-y-2">
              <Label>Output</Label>
              <div className="p-2 bg-muted rounded-md">
                <pre className="text-sm whitespace-pre-wrap">{output}</pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 