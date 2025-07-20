
import { Bot, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AgentStatusCardsProps {
  activeAgents?: number;
  idleAgents?: number;
  errorAgents?: number;
}

export function AgentStatusCards({ 
  activeAgents = 16, 
  idleAgents = 5, 
  errorAgents = 3 
}: AgentStatusCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="overflow-hidden bg-gradient-to-b from-purple-900/20 to-background border-l-2 border-l-green-500">
        <CardContent className="flex items-center p-6">
          <div className="bg-green-500/20 p-3 rounded-xl mr-4 backdrop-blur-sm">
            <Bot className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="font-semibold text-2xl text-gradient">{activeAgents}</p>
            <p className="text-sm text-muted-foreground">Active Agents</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden bg-gradient-to-b from-purple-900/20 to-background border-l-2 border-l-yellow-500">
        <CardContent className="flex items-center p-6">
          <div className="bg-yellow-500/20 p-3 rounded-xl mr-4 backdrop-blur-sm">
            <Clock className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <p className="font-semibold text-2xl text-gradient">{idleAgents}</p>
            <p className="text-sm text-muted-foreground">Idle Agents</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden bg-gradient-to-b from-purple-900/20 to-background border-l-2 border-l-red-500">
        <CardContent className="flex items-center p-6">
          <div className="bg-red-500/20 p-3 rounded-xl mr-4 backdrop-blur-sm">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-2xl text-gradient">{errorAgents}</p>
            <p className="text-sm text-muted-foreground">Error State</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
