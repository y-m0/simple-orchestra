
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  User, 
  Edit, 
  Trash,
  ChevronDown 
} from 'lucide-react';
import { getProjectWithCompletion, createGoal } from '@/data/projects';
import { ProjectWithDetails, Goal } from '@/types/project';
import { formatDateTime } from '@/lib/utils';
import { GoalItem } from '@/components/projects/GoalItem';
import { GoalToWorkflowModal } from '@/components/projects/GoalToWorkflowModal';
import { useWorkflow } from '@/hooks/useWorkflow';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectWithDetails | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false);
  const { createWorkflow } = useWorkflow();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (projectId) {
      const projectData = getProjectWithCompletion(projectId);
      if (projectData) {
        setProject(projectData);
      } else {
        navigate('/projects', { replace: true });
      }
    }
  }, [projectId, navigate]);

  const handleCreateGoal = (goalData: Partial<Goal>) => {
    if (!project) return;
    
    const newGoal: Omit<Goal, 'id' | 'createdAt'> = {
      projectId: project.id,
      title: goalData.title || 'New Goal',
      description: goalData.description || '',
      status: goalData.status || 'pending',
      priority: goalData.priority || 'medium',
      tags: goalData.tags || [],
    };
    
    // In a real app, this would be an API call
    const createdGoal = createGoal(newGoal);
    
    if (createdGoal) {
      toast({
        title: "Goal Created",
        description: "Your new goal has been added to the project."
      });
      
      // Refresh project data
      const updatedProject = getProjectWithCompletion(project.id);
      if (updatedProject) {
        setProject(updatedProject);
      }
    }
    
    setIsGoalModalOpen(false);
  };

  const handleEditGoal = (goalId: string) => {
    if (!project) return;
    
    const goal = project.goals.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoal(goal);
      setIsEditGoalDialogOpen(true);
    }
  };

  const handleLinkToWorkflow = (goalId: string) => {
    if (!project) return;
    
    const goal = project.goals.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoal(goal);
      setIsWorkflowModalOpen(true);
    }
  };

  const handleCreateWorkflow = (workflowData: any) => {
    if (!selectedGoal) return;
    
    // Create workflow using the useWorkflow hook
    const newWorkflow = createWorkflow(workflowData);
    
    toast({
      title: "Workflow Created",
      description: "Workflow has been created and linked to your goal."
    });
    
    // In a real app, we would update the goal with the workflow ID
    // and refresh the project data
    
    setIsWorkflowModalOpen(false);
    
    // Redirect to the workflow page
    if (newWorkflow?.id) {
      navigate(`/workflows?id=${newWorkflow.id}`);
    }
  };

  if (!project) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading project...</p>
      </div>
    );
  }

  // Group goals by status
  const pendingGoals = project.goals.filter(g => g.status === 'pending');
  const inProgressGoals = project.goals.filter(g => g.status === 'in-progress');
  const completedGoals = project.goals.filter(g => g.status === 'completed');
  const blockedGoals = project.goals.filter(g => g.status === 'blocked');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Projects
        </Button>
      </div>
      
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            {project.name}
            <Badge className={
              project.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
              project.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
              'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
            }>
              {project.status}
            </Badge>
          </h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" /> Edit Project
          </Button>
          <Button variant="destructive">
            <Trash className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Goals Completed</span>
                <span>{completedGoals.length} of {project.goals.length}</span>
              </div>
              <Progress value={project.completionPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground text-right">
                {project.completionPercentage}% complete
              </div>
            </div>
            
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created</span>
                </div>
                <span>{formatDateTime(project.createdAt, 'short')}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Updated</span>
                </div>
                <span>{formatDateTime(project.updatedAt, 'short')}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Owner</span>
                </div>
                <span>{project.owner}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Goals</CardTitle>
            <Button onClick={() => setIsGoalModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Goal
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="multiple" defaultValue={['in-progress']}>
              {/* In Progress Goals */}
              <AccordionItem value="in-progress" className="border rounded-lg p-2">
                <AccordionTrigger className="hover:no-underline px-4 py-2 [&[data-state=open]>svg]:rotate-0">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-3"></div>
                    <h3 className="text-lg font-medium">In Progress</h3>
                    <div className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-full px-2 py-0.5 ml-3">
                      {inProgressGoals.length} goals
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 pt-2">
                    {inProgressGoals.length > 0 ? (
                      inProgressGoals.map((goal) => (
                        <GoalItem
                          key={goal.id}
                          goal={goal}
                          onEdit={handleEditGoal}
                          onLinkToWorkflow={handleLinkToWorkflow}
                        />
                      ))
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No goals in progress</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Pending Goals */}
              <AccordionItem value="pending" className="border rounded-lg p-2 mt-4">
                <AccordionTrigger className="hover:no-underline px-4 py-2 [&[data-state=open]>svg]:rotate-0">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-slate-400 mr-3"></div>
                    <h3 className="text-lg font-medium">Pending</h3>
                    <div className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 text-xs rounded-full px-2 py-0.5 ml-3">
                      {pendingGoals.length} goals
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 pt-2">
                    {pendingGoals.length > 0 ? (
                      pendingGoals.map((goal) => (
                        <GoalItem
                          key={goal.id}
                          goal={goal}
                          onEdit={handleEditGoal}
                          onLinkToWorkflow={handleLinkToWorkflow}
                        />
                      ))
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No pending goals</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Completed Goals */}
              <AccordionItem value="completed" className="border rounded-lg p-2 mt-4">
                <AccordionTrigger className="hover:no-underline px-4 py-2 [&[data-state=open]>svg]:rotate-0">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-3"></div>
                    <h3 className="text-lg font-medium">Completed</h3>
                    <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs rounded-full px-2 py-0.5 ml-3">
                      {completedGoals.length} goals
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1 pt-2">
                    {completedGoals.length > 0 ? (
                      completedGoals.map((goal) => (
                        <GoalItem
                          key={goal.id}
                          goal={goal}
                          onEdit={handleEditGoal}
                          onLinkToWorkflow={handleLinkToWorkflow}
                        />
                      ))
                    ) : (
                      <p className="text-center py-4 text-muted-foreground">No completed goals yet</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Blocked Goals */}
              {blockedGoals.length > 0 && (
                <AccordionItem value="blocked" className="border rounded-lg p-2 mt-4">
                  <AccordionTrigger className="hover:no-underline px-4 py-2 [&[data-state=open]>svg]:rotate-0">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-3"></div>
                      <h3 className="text-lg font-medium">Blocked</h3>
                      <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs rounded-full px-2 py-0.5 ml-3">
                        {blockedGoals.length} goals
                      </div>
                    </div>
                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1 pt-2">
                      {blockedGoals.map((goal) => (
                        <GoalItem
                          key={goal.id}
                          goal={goal}
                          onEdit={handleEditGoal}
                          onLinkToWorkflow={handleLinkToWorkflow}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Create Goal Dialog - Would be a separate component in a real app */}
      <Dialog open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>
              Add a new goal to this project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-center py-4">
              Goal creation form would go here.
              <br />
              This would be implemented as a separate component.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGoalModalOpen(false)}>Cancel</Button>
            <Button onClick={() => handleCreateGoal({ title: 'New Goal' })}>Create Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog - Would be a separate component in a real app */}
      <Dialog open={isEditGoalDialogOpen} onOpenChange={setIsEditGoalDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>
              Update the goal details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-center py-4">
              Goal edit form would go here.
              <br />
              This would be implemented as a separate component.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditGoalDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsEditGoalDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Workflow Creation Modal */}
      {selectedGoal && (
        <GoalToWorkflowModal
          goal={selectedGoal}
          isOpen={isWorkflowModalOpen}
          onClose={() => setIsWorkflowModalOpen(false)}
          onCreateWorkflow={handleCreateWorkflow}
        />
      )}
    </div>
  );
}
