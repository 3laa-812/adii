import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Users, Key, Webhook, Plus, Edit, Trash2, Copy, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  permissions: string[];
  created_at: string;
  last_used_at?: string;
  is_active: boolean;
  expires_at?: string;
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  is_active: boolean;
  secret: string;
  retry_count: number;
  last_triggered_at?: string;
  last_response_status?: number;
}

interface UserRole {
  id: string;
  user_email: string;
  role: 'admin' | 'operator' | 'viewer';
  permissions: string[];
  created_at: string;
}

export const SettingsPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  
  // Organization profile
  const [orgProfile, setOrgProfile] = useState({
    name: "Toll Road Management System",
    address: "123 Business Street, Cairo, Egypt",
    phone: "+20 2 1234 5678",
    email: "admin@tollroad.com",
    tax_id: "123456789"
  });

  // Modal states
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isWebhookOpen, setIsWebhookOpen] = useState(false);
  const [isUserRoleOpen, setIsUserRoleOpen] = useState(false);
  const [showApiKeySecret, setShowApiKeySecret] = useState<string | null>(null);

  // Form states
  const [apiKeyForm, setApiKeyForm] = useState({
    name: "",
    permissions: [] as string[],
    expires_at: ""
  });

  const [webhookForm, setWebhookForm] = useState({
    name: "",
    url: "",
    events: [] as string[],
    is_active: true
  });

  const [userRoleForm, setUserRoleForm] = useState({
    user_email: "",
    role: "viewer" as const,
    permissions: [] as string[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch API keys
      const { data: apiKeysData, error: apiKeysError } = await supabase
        .from("api_keys")
        .select("*")
        .order("created_at", { ascending: false });

      if (apiKeysError) throw apiKeysError;

      // Fetch webhooks
      const { data: webhooksData, error: webhooksError } = await supabase
        .from("webhooks")
        .select("*")
        .order("created_at", { ascending: false });

      if (webhooksError) throw webhooksError;

      setApiKeys(apiKeysData || []);
      setWebhooks(webhooksData || []);

      // Mock user roles (since we don't have user management yet)
      setUserRoles([
        {
          id: "1",
          user_email: "admin@example.com",
          role: "admin",
          permissions: ["read", "write", "delete", "manage_users"],
          created_at: "2024-01-01T00:00:00Z"
        },
        {
          id: "2",
          user_email: "operator@example.com",
          role: "operator",
          permissions: ["read", "write"],
          created_at: "2024-01-02T00:00:00Z"
        }
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch settings data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newApiKey = {
        name: apiKeyForm.name,
        permissions: apiKeyForm.permissions,
        expires_at: apiKeyForm.expires_at || null,
        key_prefix: `sk_${Date.now().toString().slice(-8)}`,
        key_hash: `hashed_key_${Date.now()}`,
        is_active: true
      };

      const { data, error } = await supabase
        .from("api_keys")
        .insert([newApiKey])
        .select()
        .single();

      if (error) throw error;

      setShowApiKeySecret(data.id);
      toast({
        title: "API Key Created",
        description: "Please copy and save the API key securely",
      });

      fetchData();
      resetApiKeyForm();
    } catch (error) {
      console.error("Error creating API key:", error);
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    }
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newWebhook = {
        name: webhookForm.name,
        url: webhookForm.url,
        events: webhookForm.events,
        is_active: webhookForm.is_active,
        secret: `whsec_${Date.now()}`,
        retry_count: 3
      };

      const { error } = await supabase
        .from("webhooks")
        .insert([newWebhook]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Webhook created successfully",
      });

      fetchData();
      resetWebhookForm();
    } catch (error) {
      console.error("Error creating webhook:", error);
      toast({
        title: "Error",
        description: "Failed to create webhook",
        variant: "destructive",
      });
    }
  };

  const handleToggleApiKey = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from("api_keys")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `API key ${is_active ? 'activated' : 'deactivated'}`,
      });

      fetchData();
    } catch (error) {
      console.error("Error toggling API key:", error);
      toast({
        title: "Error",
        description: "Failed to update API key",
        variant: "destructive",
      });
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from("api_keys")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "API key deleted successfully",
      });

      fetchData();
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const resetApiKeyForm = () => {
    setApiKeyForm({
      name: "",
      permissions: [],
      expires_at: ""
    });
    setIsApiKeyOpen(false);
  };

  const resetWebhookForm = () => {
    setWebhookForm({
      name: "",
      url: "",
      events: [],
      is_active: true
    });
    setIsWebhookOpen(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading settings...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">
            Manage organization profile, user roles, API keys, and webhooks
          </p>
        </div>

        <Tabs defaultValue="organization" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="organization">
              <Building className="h-4 w-4 mr-2" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users & Roles
            </TabsTrigger>
            <TabsTrigger value="api-keys">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="webhooks">
              <Webhook className="h-4 w-4 mr-2" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          {/* Organization Profile */}
          <TabsContent value="organization">
            <Card>
              <CardHeader>
                <CardTitle>Organization Profile</CardTitle>
                <CardDescription>
                  Update your organization information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="org_name">Organization Name</Label>
                    <Input
                      id="org_name"
                      value={orgProfile.name}
                      onChange={(e) => setOrgProfile({...orgProfile, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="org_email">Email</Label>
                    <Input
                      id="org_email"
                      type="email"
                      value={orgProfile.email}
                      onChange={(e) => setOrgProfile({...orgProfile, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="org_address">Address</Label>
                  <Textarea
                    id="org_address"
                    value={orgProfile.address}
                    onChange={(e) => setOrgProfile({...orgProfile, address: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="org_phone">Phone</Label>
                    <Input
                      id="org_phone"
                      value={orgProfile.phone}
                      onChange={(e) => setOrgProfile({...orgProfile, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="org_tax_id">Tax ID</Label>
                    <Input
                      id="org_tax_id"
                      value={orgProfile.tax_id}
                      onChange={(e) => setOrgProfile({...orgProfile, tax_id: e.target.value})}
                    />
                  </div>
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users & Roles */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage user roles and permissions
                    </CardDescription>
                  </div>
                  <Dialog open={isUserRoleOpen} onOpenChange={setIsUserRoleOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add User Role</DialogTitle>
                        <DialogDescription>
                          Assign role and permissions to a user
                        </DialogDescription>
                      </DialogHeader>
                      <form className="space-y-4">
                        <div>
                          <Label htmlFor="user_email">User Email</Label>
                          <Input
                            id="user_email"
                            type="email"
                            value={userRoleForm.user_email}
                            onChange={(e) => setUserRoleForm({...userRoleForm, user_email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select 
                            value={userRoleForm.role} 
                            onValueChange={(value: any) => setUserRoleForm({...userRoleForm, role: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="operator">Operator</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button type="submit">Add User</Button>
                          <Button type="button" variant="outline" onClick={() => setIsUserRoleOpen(false)}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRoles.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.user_email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {user.permissions.map(permission => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys */}
          <TabsContent value="api-keys">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>
                      Manage API keys for external integrations
                    </CardDescription>
                  </div>
                  <Dialog open={isApiKeyOpen} onOpenChange={setIsApiKeyOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create API Key
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create API Key</DialogTitle>
                        <DialogDescription>
                          Generate a new API key with specific permissions
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateApiKey} className="space-y-4">
                        <div>
                          <Label htmlFor="api_name">Key Name</Label>
                          <Input
                            id="api_name"
                            value={apiKeyForm.name}
                            onChange={(e) => setApiKeyForm({...apiKeyForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="expires_at">Expires At (Optional)</Label>
                          <Input
                            id="expires_at"
                            type="date"
                            value={apiKeyForm.expires_at}
                            onChange={(e) => setApiKeyForm({...apiKeyForm, expires_at: e.target.value})}
                          />
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button type="submit">Create Key</Button>
                          <Button type="button" variant="outline" onClick={resetApiKeyForm}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key Prefix</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell className="font-mono">{key.key_prefix}...</TableCell>
                        <TableCell>{new Date(key.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={key.is_active ? 'default' : 'secondary'}>
                            {key.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => copyToClipboard(key.key_prefix)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Switch
                              checked={key.is_active}
                              onCheckedChange={(checked) => handleToggleApiKey(key.id, checked)}
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteApiKey(key.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhooks */}
          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Webhook Endpoints</CardTitle>
                    <CardDescription>
                      Configure webhook endpoints for real-time notifications
                    </CardDescription>
                  </div>
                  <Dialog open={isWebhookOpen} onOpenChange={setIsWebhookOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Webhook
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Webhook</DialogTitle>
                        <DialogDescription>
                          Configure a webhook endpoint for event notifications
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateWebhook} className="space-y-4">
                        <div>
                          <Label htmlFor="webhook_name">Name</Label>
                          <Input
                            id="webhook_name"
                            value={webhookForm.name}
                            onChange={(e) => setWebhookForm({...webhookForm, name: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="webhook_url">URL</Label>
                          <Input
                            id="webhook_url"
                            type="url"
                            value={webhookForm.url}
                            onChange={(e) => setWebhookForm({...webhookForm, url: e.target.value})}
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="webhook_active"
                            checked={webhookForm.is_active}
                            onCheckedChange={(checked) => setWebhookForm({...webhookForm, is_active: checked})}
                          />
                          <Label htmlFor="webhook_active">Active</Label>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button type="submit">Create Webhook</Button>
                          <Button type="button" variant="outline" onClick={resetWebhookForm}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>URL</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Triggered</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.map((webhook) => (
                      <TableRow key={webhook.id}>
                        <TableCell className="font-medium">{webhook.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{webhook.url}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {webhook.events.map(event => (
                              <Badge key={event} variant="outline" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={webhook.is_active ? 'default' : 'secondary'}>
                            {webhook.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {webhook.last_triggered_at ? 
                            new Date(webhook.last_triggered_at).toLocaleDateString() : 
                            'Never'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions */}
          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle>Role-Based Access Control</CardTitle>
                <CardDescription>
                  Configure permissions for different user roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Admin</CardTitle>
                        <CardDescription>Full system access</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Badge variant="default">All Permissions</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Operator</CardTitle>
                        <CardDescription>Daily operations management</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Badge variant="outline">View Entries</Badge>
                          <Badge variant="outline">Manage Vehicles</Badge>
                          <Badge variant="outline">Process Transactions</Badge>
                          <Badge variant="outline">Generate Reports</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Viewer</CardTitle>
                        <CardDescription>Read-only access</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Badge variant="secondary">View Entries</Badge>
                          <Badge variant="secondary">View Reports</Badge>
                          <Badge variant="secondary">View Analytics</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};