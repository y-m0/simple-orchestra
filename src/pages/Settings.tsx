
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRoleSettings } from "@/components/settings/UserRoleSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AgentPoliciesSettings } from "@/components/settings/AgentPoliciesSettings";
import { DataConnectionsSettings } from "@/components/settings/DataConnectionsSettings";
import { AnalyticsSettings } from "@/components/settings/AnalyticsSettings";
import { WorkflowSettings } from "@/components/settings/WorkflowSettings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Platform Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user-roles" className="w-full">
            <TabsList className="mb-4 w-full md:w-auto">
              <TabsTrigger value="user-roles">User Roles</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="agent-policies">Agent Policies</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
              <TabsTrigger value="data-connections">Data Connections</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="user-roles">
              <UserRoleSettings />
            </TabsContent>
            
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
            
            <TabsContent value="agent-policies">
              <AgentPoliciesSettings />
            </TabsContent>
            
            <TabsContent value="workflows">
              <WorkflowSettings />
            </TabsContent>
            
            <TabsContent value="data-connections">
              <DataConnectionsSettings />
            </TabsContent>
            
            <TabsContent value="analytics">
              <AnalyticsSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
