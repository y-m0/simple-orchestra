
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { useState } from "react";

export function QuickFilters() {
  const [team, setTeam] = useState("all");
  const [workflow, setWorkflow] = useState("all");
  
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Team
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filter by Team</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={team} onValueChange={setTeam}>
            <DropdownMenuRadioItem value="all">All Teams</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="finance">Finance</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="marketing">Marketing</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="operations">Operations</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="hr">HR</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Workflow
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Filter by Workflow</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={workflow} onValueChange={setWorkflow}>
            <DropdownMenuRadioItem value="all">All Workflows</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="reporting">Reporting</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="customer-support">Customer Support</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="data-processing">Data Processing</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
