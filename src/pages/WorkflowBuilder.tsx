
import { useState } from "react";
import { Play, PanelLeft, ChevronRight, ChevronDown, Plus, Filter, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { WorkflowCard } from "@/components/workflow/WorkflowCard";
import { groupedWorkflows } from "@/data/workflows";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function WorkflowBuilder() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [complexityFilter, setComplexityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const filteredWorkflows = {
    low: groupedWorkflows.low.filter(workflow => 
      (workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       workflow.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (complexityFilter === "all" || workflow.complexity === complexityFilter) &&
      (statusFilter === "all" || workflow.status === statusFilter)
    ),
    medium: groupedWorkflows.medium.filter(workflow => 
      (workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       workflow.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (complexityFilter === "all" || workflow.complexity === complexityFilter) &&
      (statusFilter === "all" || workflow.status === statusFilter)
    ),
    high: groupedWorkflows.high.filter(workflow => 
      (workflow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       workflow.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (complexityFilter === "all" || workflow.complexity === complexityFilter) &&
      (statusFilter === "all" || workflow.status === statusFilter)
    )
  };
  
  const totalFilteredWorkflows = 
    filteredWorkflows.low.length + 
    filteredWorkflows.medium.length + 
    filteredWorkflows.high.length;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Workflows</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-2">Dashboard</span>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span>Workflows</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4 mr-2" /> Test All
          </Button>
          <Button variant="outline" size="sm">
            <PanelLeft className="h-4 w-4 mr-2" /> New Workflow
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" /> Create Workflow
          </Button>
        </div>
      </div>
      
      <Card className="p-4">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between mb-4 flex-col sm:flex-row gap-4">
            <TabsList>
              <TabsTrigger value="all">All Workflows</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <div className="relative">
                <Input
                  placeholder="Search workflows..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FileCheck className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              
              <Select value={complexityFilter} onValueChange={setComplexityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Complexities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Sort by Name</DropdownMenuItem>
                  <DropdownMenuItem>Sort by Last Run</DropdownMenuItem>
                  <DropdownMenuItem>Sort by Success Rate</DropdownMenuItem>
                  <DropdownMenuItem>Most Used</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <TabsContent value="all" className="space-y-6">
            {searchQuery || complexityFilter !== "all" || statusFilter !== "all" ? (
              <div className="text-sm mb-2">
                <span>Showing {totalFilteredWorkflows} results </span>
                {searchQuery && (
                  <Badge variant="outline" className="ml-2">
                    Search: {searchQuery}
                    <button 
                      className="ml-1 hover:text-destructive" 
                      onClick={() => setSearchQuery("")}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {complexityFilter !== "all" && (
                  <Badge variant="outline" className="ml-2">
                    Complexity: {complexityFilter}
                    <button 
                      className="ml-1 hover:text-destructive" 
                      onClick={() => setComplexityFilter("all")}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="outline" className="ml-2">
                    Status: {statusFilter}
                    <button 
                      className="ml-1 hover:text-destructive" 
                      onClick={() => setStatusFilter("all")}
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground mb-4">
                Browse example automation workflows grouped by complexity. Each workflow shows how agents can be orchestrated to solve business problems.
              </div>
            )}
            
            <Accordion type="multiple" defaultValue={['low-complexity']}>
              {/* Low Complexity Workflows */}
              {filteredWorkflows.low.length > 0 && (
                <AccordionItem value="low-complexity" className="border rounded-lg p-2">
                  <AccordionTrigger className="hover:no-underline px-4 py-2 [&[data-state=open]>svg]:rotate-0">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
                      <h3 className="text-lg font-medium">Low Complexity Workflows</h3>
                      <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs rounded-full px-2 py-0.5 ml-3">
                        Simple 2-3 step automations
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                      {filteredWorkflows.low.map((workflow) => (
                        <WorkflowCard
                          key={workflow.id}
                          title={workflow.title}
                          description={workflow.description}
                          trigger={workflow.trigger}
                          complexity={workflow.complexity}
                          status={workflow.status}
                          successRate={workflow.successRate}
                          avgRunTime={workflow.avgRunTime}
                          workflowId={workflow.id}
                          lastModifiedBy="John Doe"
                          updatedAt="2 hours ago"
                          totalRuns={Math.floor(Math.random() * 100) + 1}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {/* Medium Complexity Workflows */}
              {filteredWorkflows.medium.length > 0 && (
                <AccordionItem value="medium-complexity" className="border rounded-lg p-2 mt-4">
                  <AccordionTrigger className="hover:no-underline px-4 py-2 [&[data-state=open]>svg]:rotate-0">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-yellow-500 mr-3"></div>
                      <h3 className="text-lg font-medium">Medium Complexity Workflows</h3>
                      <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 text-xs rounded-full px-2 py-0.5 ml-3">
                        Multi-step processes with conditionals
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                      {filteredWorkflows.medium.map((workflow) => (
                        <WorkflowCard
                          key={workflow.id}
                          title={workflow.title}
                          description={workflow.description}
                          trigger={workflow.trigger}
                          complexity={workflow.complexity}
                          status={workflow.status}
                          successRate={workflow.successRate}
                          avgRunTime={workflow.avgRunTime}
                          workflowId={workflow.id}
                          lastModifiedBy="Sarah Johnson"
                          updatedAt="1 day ago"
                          totalRuns={Math.floor(Math.random() * 50) + 1}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {/* High Complexity Workflows */}
              {filteredWorkflows.high.length > 0 && (
                <AccordionItem value="high-complexity" className="border rounded-lg p-2 mt-4">
                  <AccordionTrigger className="hover:no-underline px-4 py-2 [&[data-state=open]>svg]:rotate-0">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-3"></div>
                      <h3 className="text-lg font-medium">High Complexity Workflows</h3>
                      <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs rounded-full px-2 py-0.5 ml-3">
                        Advanced multi-agent orchestrations
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                      {filteredWorkflows.high.map((workflow) => (
                        <WorkflowCard
                          key={workflow.id}
                          title={workflow.title}
                          description={workflow.description}
                          trigger={workflow.trigger}
                          complexity={workflow.complexity}
                          status={workflow.status}
                          successRate={workflow.successRate}
                          avgRunTime={workflow.avgRunTime}
                          workflowId={workflow.id}
                          lastModifiedBy="Alex Wong"
                          updatedAt="3 days ago"
                          totalRuns={Math.floor(Math.random() * 30) + 1}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {/* No Results */}
              {totalFilteredWorkflows === 0 && (
                <div className="text-center py-12">
                  <FileCheck className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">No workflows found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="active" className="text-center py-12 text-muted-foreground">
            <p>Switch to the "All Workflows" tab to view example workflows</p>
          </TabsContent>
          
          <TabsContent value="drafts" className="text-center py-12 text-muted-foreground">
            <p>Switch to the "All Workflows" tab to view example workflows</p>
          </TabsContent>
          
          <TabsContent value="templates" className="text-center py-12 text-muted-foreground">
            <p>No workflow templates available. Create templates from existing workflows.</p>
          </TabsContent>
          
          <TabsContent value="archived" className="text-center py-12 text-muted-foreground">
            <p>No archived workflows found.</p>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
