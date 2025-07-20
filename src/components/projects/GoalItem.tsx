
import { FC, useState } from 'react';
import { Goal } from '@/types/project';
import { cn, formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Link, ArrowRight } from 'lucide-react';

interface GoalItemProps {
  goal: Goal;
  onEdit: (goalId: string) => void;
  onLinkToWorkflow: (goalId: string) => void;
}

export const GoalItem: FC<GoalItemProps> = ({ goal, onEdit, onLinkToWorkflow }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const statusColors = {
    'pending': 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'blocked': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  
  const priorityColors = {
    'low': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'urgent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="border rounded-md p-4 mb-3 hover:border-primary/50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium">{goal.title}</h4>
          {isExpanded && (
            <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className={statusColors[goal.status]}>
            {goal.status}
          </Badge>
          <Badge className={priorityColors[goal.priority]}>
            {goal.priority}
          </Badge>
        </div>
      </div>
      
      <div 
        className={cn("mt-2 pt-2 transition-all", 
          isExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
        )}
      >
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>Created {formatDateTime(goal.createdAt, 'relative')}</span>
        </div>
        
        {goal.tags && goal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {goal.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Button>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(goal.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          
          {!goal.workflowId && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onLinkToWorkflow(goal.id)}
            >
              <Link className="h-4 w-4 mr-1" />
              Create Workflow
            </Button>
          )}
          
          {goal.workflowId && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => window.location.href = `/workflows?id=${goal.workflowId}`}
            >
              <ArrowRight className="h-4 w-4 mr-1" />
              View Workflow
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
