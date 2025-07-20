import React from 'react';
import { useWorkflowStore } from '../../lib/workflowStore';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ConnectionFormProps {
  type: 'postgresql' | 's3' | 'pinecone';
  onSubmit: (data: any) => void;
}

const ConnectionForm: React.FC<ConnectionFormProps> = ({ type, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    region: '',
    bucket: '',
    apiKey: '',
    environment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getFormFields = () => {
    switch (type) {
      case 'postgresql':
        return (
          <>
            <div className="space-y-2">
              <Label>Host</Label>
              <Input
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                placeholder="localhost"
              />
            </div>
            <div className="space-y-2">
              <Label>Port</Label>
              <Input
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                placeholder="5432"
              />
            </div>
            <div className="space-y-2">
              <Label>Database</Label>
              <Input
                value={formData.database}
                onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                placeholder="database_name"
              />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="username"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="password"
              />
            </div>
          </>
        );
      case 's3':
        return (
          <>
            <div className="space-y-2">
              <Label>Region</Label>
              <Input
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                placeholder="us-east-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Bucket</Label>
              <Input
                value={formData.bucket}
                onChange={(e) => setFormData({ ...formData, bucket: e.target.value })}
                placeholder="bucket-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Access Key</Label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="access key"
              />
            </div>
            <div className="space-y-2">
              <Label>Secret Key</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="secret key"
              />
            </div>
          </>
        );
      case 'pinecone':
        return (
          <>
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="API key"
              />
            </div>
            <div className="space-y-2">
              <Label>Environment</Label>
              <Input
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                placeholder="environment"
              />
            </div>
          </>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Connection Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="My Connection"
        />
      </div>
      {getFormFields()}
      <Button type="submit" className="w-full">
        Test & Save Connection
      </Button>
    </form>
  );
};

export const DataConnections: React.FC = () => {
  const { dataConnections, addDataConnection, removeDataConnection } = useWorkflowStore();

  const handleSubmit = (type: keyof typeof dataConnections, data: any) => {
    addDataConnection(type, data);
  };

  const handleTestConnection = async (type: keyof typeof dataConnections, connection: any) => {
    // Implement connection testing logic here
    console.log(`Testing ${type} connection:`, connection);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="postgresql" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="postgresql">PostgreSQL</TabsTrigger>
              <TabsTrigger value="s3">S3</TabsTrigger>
              <TabsTrigger value="pinecone">Pinecone</TabsTrigger>
            </TabsList>
            <TabsContent value="postgresql">
              <div className="space-y-6">
                <ConnectionForm
                  type="postgresql"
                  onSubmit={(data) => handleSubmit('postgresql', data)}
                />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Active Connections</h3>
                  {dataConnections.postgresql.map((connection) => (
                    <Card key={connection.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <h4 className="font-medium">{connection.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {connection.host}:{connection.port}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestConnection('postgresql', connection)}
                          >
                            Test
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeDataConnection('postgresql', connection.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="s3">
              <div className="space-y-6">
                <ConnectionForm
                  type="s3"
                  onSubmit={(data) => handleSubmit('s3', data)}
                />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Active Connections</h3>
                  {dataConnections.s3.map((connection) => (
                    <Card key={connection.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <h4 className="font-medium">{connection.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {connection.region} - {connection.bucket}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestConnection('s3', connection)}
                          >
                            Test
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeDataConnection('s3', connection.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="pinecone">
              <div className="space-y-6">
                <ConnectionForm
                  type="pinecone"
                  onSubmit={(data) => handleSubmit('pinecone', data)}
                />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Active Connections</h3>
                  {dataConnections.pinecone.map((connection) => (
                    <Card key={connection.id}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div>
                          <h4 className="font-medium">{connection.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {connection.environment}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestConnection('pinecone', connection)}
                          >
                            Test
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeDataConnection('pinecone', connection.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 