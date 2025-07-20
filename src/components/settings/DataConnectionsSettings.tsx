import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Database, MoreHorizontal, Plus, ArrowRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Connection {
  id: string;
  name: string;
  type: string;
  status: "connected" | "disconnected" | "error";
  lastUsed: string;
  schema?: Record<string, any>;
  lastSync?: string;
}

export function DataConnectionsSettings() {
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "conn-1",
      name: "Main Database",
      type: "PostgreSQL",
      status: "connected",
      lastUsed: "Just now",
      lastSync: "2023-04-20T15:30:00Z",
      schema: {
        users: ["id", "name", "email", "created_at"],
        projects: ["id", "name", "description", "owner_id", "created_at"],
        workflows: ["id", "name", "status", "project_id", "created_by", "created_at"]
      }
    },
    {
      id: "conn-2",
      name: "Analytics Data",
      type: "BigQuery",
      status: "connected",
      lastUsed: "3 hours ago",
      lastSync: "2023-04-20T12:45:00Z",
      schema: {
        events: ["id", "type", "timestamp", "user_id", "metadata"],
        metrics: ["id", "name", "value", "timestamp", "source"],
      }
    },
    {
      id: "conn-3",
      name: "Document Storage",
      type: "S3 Bucket",
      status: "disconnected",
      lastUsed: "2 days ago",
      schema: {}
    },
    {
      id: "conn-4",
      name: "CRM System",
      type: "API",
      status: "connected",
      lastUsed: "1 day ago",
      lastSync: "2023-04-19T18:20:00Z",
      schema: {
        customers: ["id", "name", "email", "status", "created_at", "last_contact"],
        deals: ["id", "customer_id", "status", "value", "created_at"]
      }
    },
    {
      id: "conn-pinecone",
      name: "Pinecone Vector DB",
      type: "Pinecone",
      status: "connected",
      lastUsed: "Just now",
      lastSync: "2023-04-21T10:00:00Z",
      schema: {
        vectors: ["id", "values", "namespace", "metadata", "last_updated"],
        namespaces: ["name", "count"]
      }
    }
  ]);

  const [apiKeys, setApiKeys] = useState({
    openai: "sk-••••••••••••••••••••••••••••••",
    aws: "AKIA••••••••••••••••",
    gcp: "••••••••••••••••••••••••••••••"
  });

  const [llms, setLlms] = useState({
    localUrl: "",
  });

  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSyncingSchema, setIsSyncingSchema] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [isSchemaMappingOpen, setIsSchemaMappingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("connections");

  const [llmValue, setLlmValue] = useState(llms.localUrl);
  const handleSaveLlm = () => {
    setLlms({ localUrl: llmValue.trim() });
    toast({
      title: "LLM Base URL Saved",
      description: "Your local LLM endpoint has been updated.",
    });
  };

  const handleTestConnection = (connectionId: string) => {
    setIsTestingConnection(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedConnections = connections.map(conn => {
        if (conn.id === connectionId) {
          return { ...conn, status: "connected" as const };
        }
        return conn;
      });
      
      setConnections(updatedConnections);
      setIsTestingConnection(false);
      
      toast({
        title: "Connection Test Successful",
        description: "The connection is working properly.",
      });
    }, 1500);
  };

  const handleSyncSchema = (connectionId: string) => {
    setIsSyncingSchema(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSyncingSchema(false);
      
      toast({
        title: "Schema Synchronized",
        description: "The connection schema has been updated.",
      });
    }, 2000);
  };

  const handleViewSchema = (connection: Connection) => {
    setSelectedConnection(connection);
    setIsSchemaModalOpen(true);
  };

  const handleOpenSchemaMapping = (connection: Connection) => {
    setSelectedConnection(connection);
    setIsSchemaMappingOpen(true);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="connections">Data Connections</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="llms">LLMs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connections">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Data Connections</CardTitle>
                <CardDescription>Configure external data sources for agent access</CardDescription>
              </div>
              <Button onClick={() => setIsConnectionModalOpen(true)}>
                <Database className="h-4 w-4 mr-2" />
                Add Connection
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Connection Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {connections.map((connection) => (
                    <TableRow key={connection.id}>
                      <TableCell className="font-medium">{connection.name}</TableCell>
                      <TableCell>{connection.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={connection.status === "connected" ? "default" : "outline"}
                          className={
                            connection.status === "connected" 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : connection.status === "error"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : ""
                          }
                        >
                          {connection.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {connection.lastSync 
                          ? new Date(connection.lastSync).toLocaleString() 
                          : "Never"}
                      </TableCell>
                      <TableCell>{connection.lastUsed}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleTestConnection(connection.id)}>
                              Test Connection
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSyncSchema(connection.id)}>
                              Sync Schema
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewSchema(connection)}>
                              View Schema
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenSchemaMapping(connection)}>
                              Schema Mapping
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api-keys">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API keys for external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input id="openai-key" type="password" value={apiKeys.openai} readOnly />
                  <Button variant="outline">Reveal</Button>
                  <Button variant="outline">Update</Button>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="aws-key">AWS Access Key</Label>
                <div className="flex gap-2">
                  <Input id="aws-key" type="password" value={apiKeys.aws} readOnly />
                  <Button variant="outline">Reveal</Button>
                  <Button variant="outline">Update</Button>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="gcp-key">Google Cloud Key</Label>
                <div className="flex gap-2">
                  <Input id="gcp-key" type="password" value={apiKeys.gcp} readOnly />
                  <Button variant="outline">Reveal</Button>
                  <Button variant="outline">Update</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llms">
          <Card>
            <CardHeader>
              <CardTitle>Local LLM Connections</CardTitle>
              <CardDescription>
                Add a local Large Language Model endpoint for your workflows and agents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSaveLlm();
                }}
                className="space-y-4 max-w-md"
              >
                <div className="grid gap-2">
                  <Label htmlFor="llm-endpoint">Local LLM Base URL</Label>
                  <Input
                    id="llm-endpoint"
                    type="url"
                    inputMode="url"
                    placeholder="http://localhost:8000/v1/"
                    value={llmValue}
                    onChange={e => setLlmValue(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Example: http://localhost:8000/v1/ (Ollama, LM Studio, etc)
                  </p>
                </div>
                <Button type="submit" variant="default">
                  Save
                </Button>
                {llms.localUrl && (
                  <div className="mt-4 text-sm text-green-600 dark:text-green-400">
                    Current LLM Base URL: <span className="font-mono break-all">{llms.localUrl}</span>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isConnectionModalOpen} onOpenChange={setIsConnectionModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Data Connection</DialogTitle>
            <DialogDescription>
              Configure a new data source for your agents and workflows.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="conn-name">Connection Name</Label>
              <Input id="conn-name" placeholder="My Database" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="conn-type">Connection Type</Label>
              <Input id="conn-type" placeholder="PostgreSQL, MySQL, API, etc." />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="conn-url">Connection URL</Label>
              <Input id="conn-url" placeholder="postgresql://user:password@localhost:5432/db" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConnectionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsConnectionModalOpen(false)}>
              Add Connection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isSchemaModalOpen} onOpenChange={setIsSchemaModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schema for {selectedConnection?.name}</DialogTitle>
            <DialogDescription>
              This is the current database schema for this connection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="max-h-[400px] overflow-y-auto">
            {selectedConnection?.schema && Object.entries(selectedConnection.schema).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(selectedConnection.schema).map(([tableName, columns]) => (
                  <div key={tableName} className="border rounded p-3">
                    <div className="font-medium mb-2">{tableName}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {Array.isArray(columns) && columns.map((column) => (
                        <div key={column} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                          {column}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No schema information available</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => handleSyncSchema(selectedConnection?.id || '')}>
              Sync Schema
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isSchemaMappingOpen} onOpenChange={setIsSchemaMappingOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schema Mapping for {selectedConnection?.name}</DialogTitle>
            <DialogDescription>
              Map schema entities to agent context or workflow templates.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border rounded p-3">
              <h4 className="text-sm font-medium mb-2">Agent Context Mapping</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Map database tables to agent context properties
              </p>
              
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-1/2">
                    <Label>Database Table</Label>
                    <Input placeholder="Select table" />
                  </div>
                  <div className="w-8 flex items-center justify-center">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div className="w-1/2">
                    <Label>Agent Context</Label>
                    <Input placeholder="Context property" />
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Mapping
                </Button>
              </div>
            </div>
            
            <div className="border rounded p-3">
              <h4 className="text-sm font-medium mb-2">Prompt Template Variables</h4>
              <p className="text-xs text-muted-foreground mb-2">
                Use schema columns as variables in prompt templates
              </p>
              
              <div className="space-y-2">
                <Label>Sample Prompt</Label>
                <Textarea 
                  placeholder="Use {{users.name}} to get user's name" 
                  className="min-h-[100px]"
                />
                
                <div className="text-xs text-muted-foreground">
                  Available variables:
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedConnection?.schema && Object.entries(selectedConnection.schema).map(([table, columns]) => (
                      Array.isArray(columns) && columns.map(column => (
                        <Badge key={`${table}.${column}`} variant="secondary" className="text-xs">
                          {`{{${table}.${column}}}`}
                        </Badge>
                      ))
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSchemaMappingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsSchemaMappingOpen(false)}>
              Save Mappings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
