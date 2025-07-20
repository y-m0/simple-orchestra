
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function UserRoleSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Roles & Access Control</CardTitle>
        <CardDescription>
          Configure user roles and permissions for accessing platform features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>View Agents</TableHead>
              <TableHead>Create Agents</TableHead>
              <TableHead>Edit Workflows</TableHead>
              <TableHead>Approvals</TableHead>
              <TableHead>Admin Access</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Administrator</TableCell>
              <TableCell><Switch checked disabled /></TableCell>
              <TableCell><Switch checked disabled /></TableCell>
              <TableCell><Switch checked disabled /></TableCell>
              <TableCell><Switch checked disabled /></TableCell>
              <TableCell><Switch checked disabled /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Manager</TableCell>
              <TableCell><Switch checked /></TableCell>
              <TableCell><Switch checked /></TableCell>
              <TableCell><Switch checked /></TableCell>
              <TableCell><Switch checked /></TableCell>
              <TableCell><Switch /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Developer</TableCell>
              <TableCell><Switch checked /></TableCell>
              <TableCell><Switch checked /></TableCell>
              <TableCell><Switch checked /></TableCell>
              <TableCell><Switch /></TableCell>
              <TableCell><Switch /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Analyst</TableCell>
              <TableCell><Switch checked /></TableCell>
              <TableCell><Switch /></TableCell>
              <TableCell><Switch /></TableCell>
              <TableCell><Switch /></TableCell>
              <TableCell><Switch /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Viewer</TableCell>
              <TableCell><Switch checked /></TableCell>
              <TableCell><Switch /></TableCell>
              <TableCell><Switch /></TableCell>
              <TableCell><Switch /></TableCell>
              <TableCell><Switch /></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
          <Button>Add New Role</Button>
        </div>
      </CardContent>
    </Card>
  );
}
