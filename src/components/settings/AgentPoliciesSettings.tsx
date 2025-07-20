
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function AgentPoliciesSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Policies</CardTitle>
        <CardDescription>Configure default behaviors and restrictions for agents</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Default Agent Restrictions</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="require-approval">Require Approval for Actions</Label>
              <p className="text-sm text-muted-foreground">Agents must get human approval before executing tasks</p>
            </div>
            <Switch id="require-approval" checked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enforce-limits">Enforce API Rate Limits</Label>
              <p className="text-sm text-muted-foreground">Limit the number of API calls an agent can make</p>
            </div>
            <Switch id="enforce-limits" checked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sandbox">Sandbox Environment</Label>
              <p className="text-sm text-muted-foreground">Run agents in isolated environments</p>
            </div>
            <Switch id="sandbox" checked />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Resource Limits</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="memory-limit">Memory Limit (MB)</Label>
            <Input id="memory-limit" type="number" defaultValue={512} />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="timeout">Execution Timeout (seconds)</Label>
            <Input id="timeout" type="number" defaultValue={120} />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="max-requests">Max API Requests (per minute)</Label>
            <Input id="max-requests" type="number" defaultValue={60} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
