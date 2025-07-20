import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Filter, Search, FolderOpen } from 'lucide-react';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectWithDetails, Project } from '@/types/project';
import { getProjects } from '@/data/projects';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/useIsMobile';

const PROJECT_STATUSES = [
  { label: "All Projects", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Archived", value: "archived" }
];

export default function Projects() {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectWithDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Load demo sample projects matching all tab types
  useEffect(() => {
    const allProjects = getProjects().map(project => {
      const totalGoals = project.goals.length;
      const completedGoals = project.goals.filter(g => g.status === 'completed').length;
      const completionPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
      return { ...project, completionPercentage };
    });
    // Ensure one project per status (active, completed, archived) for the example
    const requiredStatuses: ("active" | "completed" | "archived")[] = ["active", "completed", "archived"];
    let projectsWithDetails = [...allProjects];
    requiredStatuses.forEach(status => {
      if (!projectsWithDetails.some(p => p.status === status)) {
        projectsWithDetails.push({
          ...allProjects[0],
          id: `sample-${status}`,
          name: `Sample ${status.charAt(0).toUpperCase()+status.slice(1)} Project`,
          status: status, // Now explicitly typed as 'active', 'completed', or 'archived'
          completionPercentage: status === "active" ? 48 : status === "completed" ? 100 : 10,
          tags: ["demo"],
          description: `This is a sample ${status} project for demonstration.`,
          goals: [],
          owner: 'Demo',
          collaborators: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });
    setProjects(projectsWithDetails);
    setFilteredProjects(projectsWithDetails);
  }, []);

  // Filter projects when search query or tab changes
  useEffect(() => {
    let filtered = [...projects];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(query) || 
        project.description.toLowerCase().includes(query) ||
        project.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    if (activeTab !== 'all') {
      filtered = filtered.filter(project => project.status === activeTab);
    }
    setFilteredProjects(filtered);
  }, [searchQuery, activeTab, projects]);

  const handleCreateProject = (newProject: Partial<Project>) => {
    // In a real app, this would call an API and refresh
    toast({
      title: "Project Created",
      description: "Your new project has been created successfully.",
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditProject = (projectId: string) => {
    // For edit action
    console.log('Edit project:', projectId);
  };

  return (
    <div className="space-y-6">
      {/* Top heading and action */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Plan, organize, and track your goals and workflows</span>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> New Project
        </Button>
      </div>
      
      <Card className="p-4">
        {/* Responsive status selection */}
        <div className="flex justify-between mb-4 flex-col sm:flex-row gap-4">
          {/* Tab navigation (desktop) or dropdown (mobile) */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {isMobile ? (
              <select
                value={activeTab}
                onChange={e => setActiveTab(e.target.value)}
                className="block w-full rounded border-input bg-background py-2 px-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {PROJECT_STATUSES.map(tab => (
                  <option value={tab.value} key={tab.value}>{tab.label}</option>
                ))}
              </select>
            ) : (
              <TabsList>
                {PROJECT_STATUSES.map(tab => (
                  <TabsTrigger value={tab.value} key={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
          
            <div className="flex gap-2 mt-4 sm:mt-0">
              <div className="relative">
                <Input
                  placeholder="Search projects..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Tab content: filtered project cards or empty state */}
            <TabsContent value={activeTab} className="mt-6">
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project}
                      onEdit={handleEditProject}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-2">No projects found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? "Try adjusting your search criteria" 
                      : "Get started by creating your first project"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Create Project
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Create a new project to organize your goals and workflows.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-center py-4">
              Project creation form would go here.<br />
              This would be implemented as a separate component.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleCreateProject({ name: 'New Project' })}>
              Create Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
