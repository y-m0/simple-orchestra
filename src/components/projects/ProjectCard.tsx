
import { FC } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProjectWithDetails } from '@/types/project';
import { formatDateTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FolderOpen, Edit, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: ProjectWithDetails;
  onEdit?: (projectId: string) => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({ project, onEdit }) => {
  const navigate = useNavigate();
  
  const handleOpenProject = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{project.name}</h3>
            <p className="text-sm text-muted-foreground">{project.description}</p>
          </div>
          <Badge
            variant={project.status === 'active' ? 'default' : 
                   project.status === 'completed' ? 'secondary' : 'outline'}
          >
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Progress</span>
            <span>{project.completionPercentage}%</span>
          </div>
          <Progress value={project.completionPercentage} className="h-2" />
        </div>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>Updated {formatDateTime(project.updatedAt, 'relative')}</span>
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={handleOpenProject}>
          <FolderOpen className="h-4 w-4 mr-1" /> View
        </Button>
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={() => onEdit(project.id)}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
