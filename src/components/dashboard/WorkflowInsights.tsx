
import { useState, useEffect } from "react";
import { CalendarClock, Activity, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkflow } from "@/hooks/useWorkflow";
import { WorkflowRun } from "@/types/workflow";

export function WorkflowInsights() {
  const { workflowRuns } = useWorkflow();
  const [recentRuns, setRecentRuns] = useState<WorkflowRun[]>([]);
  const [topWorkflows, setTopWorkflows] = useState<{id: string, title: string, runs: number}[]>([]);

  useEffect(() => {
    // Get recent runs (last 5)
    const sortedRuns = [...workflowRuns].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    ).slice(0, 5);
    setRecentRuns(sortedRuns);

    // Calculate top workflows based on number of runs
    const workflowCounts = workflowRuns.reduce((acc, run) => {
      acc[run.workflowId] = (acc[run.workflowId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Mock data for workflow titles since we don't have a direct mapping
    const workflowTitles: Record<string, string> = {
      'workflow-1': 'Customer Onboarding',
      'workflow-2': 'Expense Approval',
      'workflow-3': 'Data Analysis',
      'workflow-4': 'Report Generation',
      'workflow-5': 'Content Review',
    };

    const topRunsData = Object.entries(workflowCounts)
      .map(([id, runs]) => ({
        id,
        title: workflowTitles[id] || `Workflow ${id.slice(-5)}`,
        runs,
      }))
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 3);

    setTopWorkflows(topRunsData);
  }, [workflowRuns]);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Workflow Insights</CardTitle>
        <CardDescription>Recent workflow activity and performance</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="recent">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="recent">Recent Runs</TabsTrigger>
            <TabsTrigger value="top">Top Workflows</TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="space-y-4">
            {recentRuns.length > 0 ? (
              recentRuns.map((run) => (
                <div key={run.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      run.status === 'completed' ? 'bg-green-500' : 
                      run.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium">Workflow {run.workflowId.slice(-5)}</p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <CalendarClock className="h-3 w-3 mr-1" />
                        {new Date(run.startTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-medium">
                    {run.status === 'completed' && 
                      <span className="text-green-500">Completed</span>}
                    {run.status === 'error' && 
                      <span className="text-red-500">Failed</span>}
                    {run.status === 'running' && 
                      <span className="text-blue-500">Running</span>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No recent workflow runs</p>
            )}
          </TabsContent>
          <TabsContent value="top">
            {topWorkflows.length > 0 ? (
              <div className="space-y-4">
                {topWorkflows.map((workflow, i) => (
                  <div key={workflow.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs`}>
                        {i + 1}
                      </div>
                      <span className="font-medium">{workflow.title}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm">
                      <Activity className="h-4 w-4" />
                      <span>{workflow.runs} runs</span>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t mt-2 text-center">
                  <a href="/workflows" className="text-sm text-primary hover:underline flex items-center justify-center">
                    <LineChart className="h-4 w-4 mr-1" />
                    View all workflow metrics
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No workflow data available</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
