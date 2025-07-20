
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { applyWorkflowSettings } from "@/components/workflow/WorkflowIntegrations";

export function WorkflowSettings() {
  const [autoApprove, setAutoApprove] = useState(false);
  const [errorRetries, setErrorRetries] = useState("1");
  const [loggingLevel, setLoggingLevel] = useState("info");
  const [concurrentRuns, setConcurrentRuns] = useState("3");
  const [defaultTimeout, setDefaultTimeout] = useState("60");
  const [notifyAdmin, setNotifyAdmin] = useState(true);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const { toast } = useToast();

  // Load saved settings if they exist
  useEffect(() => {
    // Check if we have stored settings
    if (typeof window !== 'undefined' && window.workflowDefaults) {
      const settings = window.workflowDefaults;
      
      setAutoApprove(settings.autoApprove);
      setErrorRetries(settings.errorRetries.toString());
      setLoggingLevel(settings.loggingLevel);
      setConcurrentRuns(settings.concurrentRuns.toString());
      setDefaultTimeout(settings.defaultTimeout.toString());
      setNotifyAdmin(settings.notifyAdmin);
    }
  }, []);

  // Set default workflow settings in global state
  useEffect(() => {
    // This would typically connect to a global state or API
    const workflowDefaults = {
      autoApprove,
      errorRetries: parseInt(errorRetries),
      loggingLevel,
      concurrentRuns: parseInt(concurrentRuns),
      defaultTimeout: parseInt(defaultTimeout),
      notifyAdmin,
    };
    
    // Store defaults in window object
    if (typeof window !== 'undefined') {
      window.workflowDefaults = workflowDefaults;
    }
    
    // Apply settings to any active workflows
    if (settingsSaved) {
      console.log("Workflow defaults updated:", workflowDefaults);
      
      // Apply to all current and future workflows
      const mockWorkflowId = 'workflow-all';
      applyWorkflowSettings(mockWorkflowId);
      
      // Log to activity log
      console.log(`Activity Log: Workflow settings updated at ${new Date().toLocaleTimeString()}`);
    }
  }, [autoApprove, errorRetries, loggingLevel, concurrentRuns, defaultTimeout, notifyAdmin, settingsSaved]);
  
  const handleSaveSettings = () => {
    // This would typically save to an API or global state
    setSettingsSaved(true);
    
    toast({
      title: "Settings saved",
      description: "Workflow settings have been updated successfully",
    });
    
    // Broadcast the settings change event for components to listen to
    if (typeof window !== 'undefined') {
      // Use localStorage event as a simple pub-sub mechanism
      localStorage.setItem('workflow_settings_updated', Date.now().toString());
      // This triggers a storage event that components can listen to
    }
    
    // Log the action to activity log
    console.log(`Activity Log: Workflow settings updated at ${new Date().toLocaleTimeString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-xl font-semibold">Workflow Settings</h2>
        <p className="text-muted-foreground">
          Configure how workflows run throughout the platform
        </p>
      </div>
      
      {settingsSaved && (
        <div className="bg-green-50 text-green-800 p-3 rounded-md text-sm flex items-center mb-4">
          <Check className="h-4 w-4 mr-2" />
          Settings applied to all workflows. New runs will use these settings.
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Execution Settings</CardTitle>
          <CardDescription>
            Control how workflows execute and handle errors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="error-retries">Error Retries</Label>
              <Select value={errorRetries} onValueChange={setErrorRetries}>
                <SelectTrigger id="error-retries">
                  <SelectValue placeholder="Select number of retries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - No retries</SelectItem>
                  <SelectItem value="1">1 retry</SelectItem>
                  <SelectItem value="2">2 retries</SelectItem>
                  <SelectItem value="3">3 retries</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Number of times to retry a failed workflow step
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logging-level">Logging Level</Label>
              <Select value={loggingLevel} onValueChange={setLoggingLevel}>
                <SelectTrigger id="logging-level">
                  <SelectValue placeholder="Select logging level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">Debug - Most verbose</SelectItem>
                  <SelectItem value="info">Info - Standard</SelectItem>
                  <SelectItem value="warn">Warn - Errors and warnings</SelectItem>
                  <SelectItem value="error">Error - Only errors</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Controls the level of detail in workflow logs
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="concurrent-runs">Max Concurrent Runs</Label>
              <Input 
                id="concurrent-runs" 
                type="number" 
                min="1" 
                max="10"
                value={concurrentRuns}
                onChange={(e) => setConcurrentRuns(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of workflows that can run simultaneously
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="default-timeout">Default Timeout (seconds)</Label>
              <Input 
                id="default-timeout" 
                type="number" 
                min="10"
                value={defaultTimeout}
                onChange={(e) => setDefaultTimeout(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Default timeout for workflow steps in seconds
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium">Approval Settings</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve low-risk workflows</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve human steps in workflows tagged as "low-risk"
                </p>
              </div>
              <Switch 
                checked={autoApprove}
                onCheckedChange={setAutoApprove}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notify admins of pending approvals</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications to admin users for pending approvals
                </p>
              </div>
              <Switch 
                checked={notifyAdmin}
                onCheckedChange={setNotifyAdmin}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium">Templates & Defaults</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Content Approval</div>
                  <Badge variant="outline">Simple</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Simple workflow for content approval process
                </p>
              </Card>
              
              <Card className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Data Analysis</div>
                  <Badge variant="outline">Medium</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Data processing and reporting workflow
                </p>
              </Card>
              
              <Card className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Customer Onboarding</div>
                  <Badge variant="outline">Complex</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Full customer onboarding and setup process
                </p>
              </Card>
              
              <div className="p-3 border border-dashed rounded-md flex items-center justify-center text-muted-foreground hover:border-primary cursor-pointer">
                <span className="text-sm">+ Create New Template</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Changes</Button>
      </div>
    </div>
  );
}

// Import missing Check icon at the top of file
import { Check } from "lucide-react";
