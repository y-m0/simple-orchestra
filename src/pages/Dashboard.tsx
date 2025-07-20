import { BarChart3, User, FolderOpen, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentStatusCards } from "@/components/dashboard/AgentStatusCards";
import { NotificationsWidget } from "@/components/dashboard/NotificationsWidget";
import { TaskCompletionChart } from "@/components/dashboard/TaskCompletionChart";
import { QuickFilters } from "@/components/dashboard/QuickFilters";
import { WorkflowInsights } from "@/components/dashboard/WorkflowInsights";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import { useState, useEffect } from "react";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useNavigate } from "react-router-dom";
import { useMemory } from "@/lib/memory";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WorkflowApprovals } from "@/components/approvals/WorkflowApprovals";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PendingApprovalsFeed, Approval } from "@/components/dashboard/PendingApprovalsFeed";

function useDashboardActivity() {
  const { workflowRuns, currentWorkflow } = useWorkflow();
  const { searchMemory } = useMemory();
  const [memoryActivity, setMemoryActivity] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState({
    workflowsRunning: 0,
    agentsActive: 0,
    pendingApprovals: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const results = await searchMemory({ content: "system status" });
        // Process results if needed
      } catch (err) {
        console.error("Error searching memory:", err);
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [searchMemory]);
  
  useEffect(() => {
    const runningWorkflows = workflowRuns.filter(run => run.status === 'running').length;
    
    let activeAgents = 0;
    workflowRuns.forEach(run => {
      if (run.status === 'running') {
        activeAgents += run.nodeRuns.filter(node => node.status === 'running').length;
      }
    });
    
    let pendingApprovals = 0;
    workflowRuns.forEach(run => {
      if (run.status === 'running') {
        pendingApprovals += run.nodeRuns.filter(node => 
          node.status === 'running' && node.nodeId?.includes('human')
        ).length;
      }
    });
    
    setSystemHealth({
      workflowsRunning: runningWorkflows,
      agentsActive: activeAgents,
      pendingApprovals: pendingApprovals,
      memoryUsage: Math.floor(Math.random() * 100)
    });
  }, [workflowRuns]);
  
  return {
    systemHealth,
    memoryActivity
  };
}

export default function Dashboard() {
  const [activityLogs, setActivityLogs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [memoryResults, setMemoryResults] = useState<any[]>([]);
  const { workflowRuns } = useWorkflow();
  const { searchMemory } = useMemory();
  const navigate = useNavigate();
  const { systemHealth } = useDashboardActivity();
  const isMobile = useIsMobile();
  
  const [mockApprovals, setMockApprovals] = useState<Approval[]>([
    {
      id: "appr-1",
      workflowName: "Expense Approval",
      requester: "Anna",
      submittedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      status: "pending",
      stakeholder: "John Appleseed"
    },
    {
      id: "appr-2",
      workflowName: "Content Review",
      requester: "Ben",
      submittedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: "approved",
      stakeholder: "Sarah Connor"
    },
    {
      id: "appr-3",
      workflowName: "Data Analysis",
      requester: "Charlie",
      submittedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      status: "pending",
      stakeholder: "Priya Patel"
    },
  ]);

  const [agentStats, setAgentStats] = useState({
    active: 16,
    idle: 5,
    error: 3
  });

  const sampleProjects = [
    {
      id: 'proj-crm',
      name: "Sales CRM Automation",
      description: "Automate pipeline updates, lead scoring, and task assignments across your CRM tools.",
      owner: "Dana Nguyen",
      tags: ["automation", "crm", "sales"],
      completion: 91,
      updatedAt: "2024-03-10T14:20:00Z"
    },
    {
      id: 'proj-marketing',
      name: "Social Channel Orchestration",
      description: "Manage campaigns, schedule posts, and automate reporting across all major platforms.",
      owner: "Victor Li",
      tags: ["marketing", "automation", "reporting"],
      completion: 62,
      updatedAt: "2024-04-05T11:00:00Z"
    },
    {
      id: 'proj-support',
      name: "Customer Support Routing",
      description: "Use AI to classify tickets and dynamically assign to best-fit teams with escalation logic.",
      owner: "Priya Patel",
      tags: ["support", "ai", "classification"],
      completion: 75,
      updatedAt: "2024-04-14T09:15:00Z"
    },
    {
      id: 'proj-risk',
      name: "Automated Risk Monitoring",
      description: "Continuously monitor critical KPIs and generate real-time alerts for risk mitigation.",
      owner: "Jamal Blue",
      tags: ["risk", "monitoring", "alerts"],
      completion: 55,
      updatedAt: "2024-04-19T17:45:00Z"
    }
  ];

  const handleLogActivity = (logEntry: string) => {
    setActivityLogs(prev => [logEntry, ...prev].slice(0, 10));
    console.log(`Activity Log: ${logEntry}`);
  };

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      setMemoryResults([]);
      return;
    }

    const searchMemoryItems = async () => {
      try {
        const results = await searchMemory({ content: searchQuery });
        setMemoryResults(results as any[]);
        if (results.length > 0) {
          console.log(`Activity Log: Memory searched for "${searchQuery}" with ${results.length} results`);
        }
      } catch (error) {
        console.error("Error searching memory:", error);
      }
    };

    const debounceTimer = setTimeout(searchMemoryItems, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchMemory]);

  useEffect(() => {
    if (workflowRuns.length > 0) {
      const recentRuns = [...workflowRuns].sort(
        (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      ).slice(0, 5);

      const activeRuns = recentRuns.filter(run => run.status === 'running');
      
      if (activeRuns.length > 0) {
        let activeAgents = 0;
        let errorAgents = 0;
        
        activeRuns.forEach(run => {
          activeAgents += run.nodeRuns.filter(node => node.status === 'running').length;
          errorAgents += run.nodeRuns.filter(node => node.status === 'error').length;
        });
        
        const totalAgents = agentStats.active + agentStats.idle + agentStats.error;
        const idleAgents = Math.max(0, totalAgents - activeAgents - errorAgents);
        
        setAgentStats({
          active: activeAgents > 0 ? activeAgents : agentStats.active,
          idle: idleAgents,
          error: errorAgents > 0 ? errorAgents : agentStats.error
        });
      }
    }
  }, [workflowRuns]);

  const handleTimelineItemClick = (item: any) => {
    if (item.workflowId) {
      navigate(`/workflows?id=${item.workflowId}`);
    } else if (item.agentId) {
      navigate(`/agents?id=${item.agentId}`);
    }
  };

  const handleViewWorkflow = (workflowId: string, nodeId?: string) => {
    navigate(`/workflows?id=${workflowId}${nodeId ? `&nodeId=${nodeId}` : ''}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Agent Orchestration Dashboard</h1>
        <QuickFilters />
      </div>

      <AgentStatusCards 
        activeAgents={agentStats.active} 
        idleAgents={agentStats.idle} 
        errorAgents={agentStats.error} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion</CardTitle>
              <CardDescription>Tasks completed over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pb-2">
              <TaskCompletionChart />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Live system metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <StatusCard
                  title="Workflows Running"
                  value={
                    <span className="font-semibold text-2xl text-[#9b87f5] dark:text-[#D6BCFA]">
                      {systemHealth.workflowsRunning}
                    </span>
                  }
                  icon={<FolderOpen className="h-4 w-4 text-primary" />}
                />
                <StatusCard
                  title="Active Agents"
                  value={
                    <span className="font-semibold text-2xl text-[#7E69AB] dark:text-[#D6BCFA]">
                      {systemHealth.agentsActive}
                    </span>
                  }
                  icon={<User className="h-4 w-4 text-[#9b87f5]" />}
                />
                <StatusCard
                  title="Pending Approvals"
                  value={
                    <span className="font-semibold text-2xl text-yellow-500 dark:text-yellow-200">
                      {systemHealth.pendingApprovals}
                    </span>
                  }
                  icon={<Clock className="h-3 w-3 mr-1" />}
                />
                <StatusCard
                  title="Memory Usage"
                  value={
                    <span className="font-semibold text-2xl text-[#7E69AB] dark:text-[#D6BCFA]">
                      {systemHealth.memoryUsage}%
                    </span>
                  }
                  icon={<BarChart3 className="h-4 w-4 text-[#7E69AB]" />}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Ongoing Projects</CardTitle>
            <CardDescription>
              Explore featured blueprints for automating and optimizing real-world processes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleProjects.map(project => (
                <div key={project.id} className="bg-white dark:bg-gray-900/50 rounded-lg shadow border p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-lg text-gradient-primary">{project.name}</span>
                      <span className={`rounded text-xs px-2 py-1 ${project.completion > 75 ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                        : project.completion > 60 ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-purple-100 text-purple-800 dark:bg-[#7E69AB] dark:text-white"}`}>
                        {project.completion}% complete
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {project.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 dark:bg-gray-800/70 rounded px-2 py-0.5 text-xs text-gray-700 dark:text-gray-200">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Last updated {new Date(project.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${isMobile ? 'order-2' : ''} md:col-span-2`}>
          <WorkflowInsights />
        </div>
        <div className={`${isMobile ? 'order-1' : ''}`}>
          <PendingApprovalsFeed approvals={mockApprovals.filter(a => a.status === "pending")} onView={handleViewWorkflow} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
          <CardDescription>Platform events: configuration updates, tool runs, errors, integrations, and settings changes</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityTimeline 
            onItemClick={handleTimelineItemClick}
            showFilters
            maxItems={10}
            items={[]} // In a real implementation, filter only system/tool events
          />
        </CardContent>
      </Card>
    </div>
  );
}
