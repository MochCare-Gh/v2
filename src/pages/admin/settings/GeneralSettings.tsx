
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { SaveIcon, Globe, Bell, Shield, Calendar } from "lucide-react";

export default function GeneralSettings() {
  const { toast } = useToast();
  const [systemSettings, setSystemSettings] = useState({
    siteName: "Maternal Health Tracking System",
    logoUrl: "/placeholder.svg",
    primaryColor: "#0f172a",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    defaultLanguage: "en",
    enableNotifications: true,
    enableAuditLogs: true,
    sessionTimeout: "60",
    autoLogout: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSystemSettings({
      ...systemSettings,
      [name]: value
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setSystemSettings({
      ...systemSettings,
      [name]: checked
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setSystemSettings({
      ...systemSettings,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would save to the database in a real application
    console.log("Saving settings:", systemSettings);
    
    toast({
      title: "Settings Saved",
      description: "Your system settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="localization" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Localization</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Basic system settings and configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName"
                    name="siteName"
                    value={systemSettings.siteName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input 
                    id="logoUrl"
                    name="logoUrl"
                    value={systemSettings.logoUrl}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="primaryColor"
                      name="primaryColor"
                      value={systemSettings.primaryColor}
                      onChange={handleInputChange}
                    />
                    <div 
                      className="w-10 h-10 rounded border" 
                      style={{ backgroundColor: systemSettings.primaryColor }}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <Button type="submit" className="flex items-center gap-2">
                  <SaveIcon className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when notifications are delivered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableNotifications">Enable Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle all system notifications
                    </p>
                  </div>
                  <Switch 
                    id="enableNotifications"
                    checked={systemSettings.enableNotifications}
                    onCheckedChange={(checked) => 
                      handleSwitchChange("enableNotifications", checked)
                    }
                  />
                </div>
                
                <Separator />
                
                <Button type="submit" className="flex items-center gap-2">
                  <SaveIcon className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage security preferences and access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableAuditLogs">Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Track all user actions for security auditing
                    </p>
                  </div>
                  <Switch 
                    id="enableAuditLogs"
                    checked={systemSettings.enableAuditLogs}
                    onCheckedChange={(checked) => 
                      handleSwitchChange("enableAuditLogs", checked)
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="sessionTimeout"
                    name="sessionTimeout"
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoLogout">Auto Logout</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically log out inactive users
                    </p>
                  </div>
                  <Switch 
                    id="autoLogout"
                    checked={systemSettings.autoLogout}
                    onCheckedChange={(checked) => 
                      handleSwitchChange("autoLogout", checked)
                    }
                  />
                </div>
                
                <Separator />
                
                <Button type="submit" className="flex items-center gap-2">
                  <SaveIcon className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization">
          <Card>
            <CardHeader>
              <CardTitle>Localization Settings</CardTitle>
              <CardDescription>
                Configure language, date, and time preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select 
                    value={systemSettings.dateFormat} 
                    onValueChange={(value) => handleSelectChange("dateFormat", value)}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select 
                    value={systemSettings.timeFormat} 
                    onValueChange={(value) => handleSelectChange("timeFormat", value)}
                  >
                    <SelectTrigger id="timeFormat">
                      <SelectValue placeholder="Select time format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <Select 
                    value={systemSettings.defaultLanguage} 
                    onValueChange={(value) => handleSelectChange("defaultLanguage", value)}
                  >
                    <SelectTrigger id="defaultLanguage">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <Button type="submit" className="flex items-center gap-2">
                  <SaveIcon className="h-4 w-4" />
                  <span>Save Changes</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
