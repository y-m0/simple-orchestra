
import { useState } from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AgentTool } from '@/types/tool';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Play, CheckCircle, AlertCircle } from 'lucide-react';

interface ToolTestModalProps {
  tool: AgentTool;
  isOpen: boolean;
  onClose: () => void;
}

export function ToolTestModal({ tool, isOpen, onClose }: ToolTestModalProps) {
  const [input, setInput] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestRun = async () => {
    if (!input.trim()) {
      setError('Input cannot be empty');
      return;
    }

    setError(null);
    setIsRunning(true);
    
    try {
      const result = await tool.run(input, {});
      setTestResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during testing');
      setTestResult(null);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Test Tool: {tool.name}</DialogTitle>
          <DialogDescription>
            Enter an input to test how this tool processes data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="tool-input" className="text-sm font-medium">
              Input for {tool.name}:
            </label>
            <Textarea
              id="tool-input"
              placeholder={`Enter test input for ${tool.name}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {tool.category === 'search' && 'Enter a search query to test'}
              {tool.category === 'data' && 'Enter a data source or query to test'}
              {tool.category === 'analysis' && 'Enter text to analyze'}
              {tool.category === 'communication' && 'Enter a message to send'}
              {tool.category === 'utility' && 'Enter input for this utility'}
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {testResult && (
            <div className="space-y-2 border rounded-lg p-3">
              <div className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <h4 className="font-medium">
                  {testResult.success ? 'Success' : 'Failed'}
                </h4>
              </div>
              
              <div className="text-sm">
                <div className="font-medium mt-2">Result:</div>
                <pre className="bg-slate-100 dark:bg-slate-900 p-2 rounded text-xs overflow-auto whitespace-pre-wrap">
                  {testResult.result || testResult.error || 'No result returned'}
                </pre>
                
                {testResult.metadata && (
                  <>
                    <div className="font-medium mt-2">Metadata:</div>
                    <pre className="bg-slate-100 dark:bg-slate-900 p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(testResult.metadata, null, 2)}
                    </pre>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handleTestRun} disabled={isRunning}>
            {isRunning ? (
              <>Running...</>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Test
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
