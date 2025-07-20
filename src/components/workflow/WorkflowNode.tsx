
import { DragEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WorkflowNodeProps {
  title: string;
  icon: ReactNode;
  type: 'agent' | 'logic' | 'io';
  draggable?: boolean;
}

export function WorkflowNode({ title, icon, type, draggable = false }: WorkflowNodeProps) {
  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("application/workflow", JSON.stringify({ type, title }));
    e.dataTransfer.effectAllowed = "move";
  };
  
  return (
    <div
      className={cn(
        "p-3 rounded-md border flex items-center gap-3 cursor-pointer hover:bg-accent transition-colors",
        type === 'agent' ? 'border-primary/50 bg-primary/5' : 
        type === 'logic' ? 'border-blue-500/50 bg-blue-500/5' : 
        'border-yellow-500/50 bg-yellow-500/5'
      )}
      draggable={draggable}
      onDragStart={draggable ? handleDragStart : undefined}
    >
      {icon}
      <span className="text-sm font-medium">{title}</span>
    </div>
  );
}
