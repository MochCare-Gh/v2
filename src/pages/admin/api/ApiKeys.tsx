
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Key, PlusCircle, Copy, RefreshCw, Trash2, AlertCircle, ExternalLink } from "lucide-react";

// Mock API keys for UI display
const initialApiKeys = [
  { id: 1, name: "Production API Key", key: "mhs_prod_6f8a9b2c3d4e5f", created: "2023-09-15", expires: "2024-09-15", active: true, scope: "read_write" },
  { id: 2, name: "Reporting API Key", key: "mhs_report_1a2b3c4d5e6f7g", created: "2023-10-20", expires: "2024-10-20", active: true, scope: "read_only" },
  { id: 3, name: "Development Key", key: "mhs_dev_8h9i0j1k2l3m4n", created: "2023-08-05", expires: "2024-08-05", active: false, scope: "read_write" },
];

export default function ApiKeys() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [newKeyDialogOpen, setNewKeyDialogOpen] = useState(false);
  const [newKey, setNewKey] = useState({
    name: "",
    scope: "read_only",
    expires: "1year"
  });
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewKey({
      ...newKey,
      [name]: value
    });
  };

  const handleScopeChange = (value: string) => {
    setNewKey({
      ...newKey,
      scope: value
    });
  };

  const handleExpiryChange = (value: string) => {
    setNewKey({
      ...newKey,
      expires: value
    });
  };

  const generateRandomKey = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const keyLength = 24;
    let result = 'mhs_';
    
    if (newKey.scope === 'read_only') {
      result += 'ro_';
    } else {
      result += 'rw_';
    }
    
    for (let i = 0; i < keyLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  };

  const generateNewKey = () => {
    if (!newKey.name) {
      toast({
        title: "Error",
        description: "Please provide a name for your API key",
        variant: "destructive"
      });
      return;
    }
    
    const randomKey = generateRandomKey();
    setGeneratedKey(randomKey);
  };

  const saveNewKey = () => {
    if (!generatedKey) return;
    
    const today = new Date();
    let expiryDate = new Date();
    
    if (newKey.expires === "1year") {
      expiryDate.setFullYear(today.getFullYear() + 1);
    } else if (newKey.expires === "6months") {
      expiryDate.setMonth(today.getMonth() + 6);
    } else if (newKey.expires === "3months") {
      expiryDate.setMonth(today.getMonth() + 3);
    }
    
    const newApiKey = {
      id: apiKeys.length + 1,
      name: newKey.name,
      key: generatedKey,
      created: today.toISOString().split('T')[0],
      expires: expiryDate.toISOString().split('T')[0],
      active: true,
      scope: newKey.scope
    };
    
    setApiKeys([...apiKeys, newApiKey]);
    setNewKeyDialogOpen(false);
    setGeneratedKey(null);
    setNewKey({ name: "", scope: "read_only", expires: "1year" });
    
    toast({
      title: "API Key Created",
      description: "Your new API key has been created successfully",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "API key copied to clipboard",
      });
    });
  };

  const toggleKeyStatus = (id: number, currentStatus: boolean) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, active: !currentStatus } : key
    ));
    
    toast({
      title: currentStatus ? "API Key Disabled" : "API Key Enabled",
      description: `The API key has been ${currentStatus ? "disabled" : "enabled"} successfully`,
    });
  };

  const handleDeleteKey = (id: number) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    
    toast({
      title: "API Key Deleted",
      description: "The API key has been permanently deleted",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">API Keys</h1>
        <Dialog open={newKeyDialogOpen} onOpenChange={setNewKeyDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Generate New API Key</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key to access the system programmatically.
              </DialogDescription>
            </DialogHeader>
            
            {!generatedKey ? (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Key Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={newKey.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Production API Key"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="scope">Access Scope</Label>
                  <Select value={newKey.scope} onValueChange={handleScopeChange}>
                    <SelectTrigger id="scope">
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="read_only">Read Only</SelectItem>
                      <SelectItem value="read_write">Read & Write</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {newKey.scope === "read_only" ? 
                      "Can only retrieve data, cannot modify" : 
                      "Can retrieve and modify data"}
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="expires">Expiration</Label>
                  <Select value={newKey.expires} onValueChange={handleExpiryChange}>
                    <SelectTrigger id="expires">
                      <SelectValue placeholder="Select expiration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 Months</SelectItem>
                      <SelectItem value="6months">6 Months</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-700 dark:text-yellow-400">
                    API keys provide full access to your account through the API. Safeguard them like passwords.
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-400 mb-2">
                    Your API key has been generated. Copy it now! You won't be able to see it again.
                  </p>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="apikey">Your New API Key</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="apikey"
                      type="text"
                      value={generatedKey}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyToClipboard(generatedKey)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <DialogFooter>
              {!generatedKey ? (
                <Button type="button" onClick={generateNewKey}>Generate Key</Button>
              ) : (
                <Button type="button" onClick={saveNewKey}>
                  I've Safely Stored My Key
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active API Keys</CardTitle>
          <CardDescription>
            Manage API keys for external integrations and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-6">
              <Key className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-1">No API Keys Found</h3>
              <p className="text-sm text-muted-foreground">
                Create your first API key to get started with integrations.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="flex flex-col space-y-3 p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{key.name}</h3>
                        <Badge variant={key.active ? "default" : "outline"}>
                          {key.active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {key.scope.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Created: {key.created} • Expires: {key.expires}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={key.active} 
                        onCheckedChange={() => toggleKeyStatus(key.id, key.active)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input 
                      value={key.key.substring(0, 12) + '•••••••••••••••'}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyToClipboard(key.key)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Not Implemented",
                          description: "Key regeneration would be implemented in a real API system",
                        });
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDeleteKey(key.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API Documentation</CardTitle>
            <CardDescription>
              Resources to help you integrate with our API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <ExternalLink className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">API Reference</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Comprehensive documentation of all API endpoints and methods
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-2">
                    View Documentation
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <ExternalLink className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Tutorials & Guides</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Step-by-step instructions for common API use cases
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-2">
                    View Guides
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
            <CardDescription>
              Monitor your API usage and rate limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Monthly Requests</p>
                  <p className="text-sm text-muted-foreground">2,450 / 10,000</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "24.5%" }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Rate Limit Status</p>
                  <p className="text-sm text-muted-foreground">48 / 60 per minute</p>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "80%" }}></div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
