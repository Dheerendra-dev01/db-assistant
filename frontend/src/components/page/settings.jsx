"use client";

import { useState, useEffect } from "react";
import { Settings, Moon, Sun, Palette, Bell, Shield, Database, User, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "system",
    language: "en",
    autoSave: true,
    notifications: true,
    queryTimeout: 30,
    maxResults: 1000,
    enableQueryHistory: true,
    enableAnalytics: false,
    apiEndpoint: "http://localhost:8000"
  });

  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Developer",
    organization: "Tech Corp"
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("appSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem("appSettings", JSON.stringify(settings));
  }, [settings]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileChange = (key, value) => {
    setUserProfile(prev => ({ ...prev, [key]: value }));
  };

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Palette }
  ];

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" }
  ];

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Preferences
                </CardTitle>
                <CardDescription>
                  Configure basic application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Language</label>
                    <p className="text-sm text-gray-500">Choose your preferred language</p>
                  </div>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={settings.language}
                    onChange={(e) => handleSettingChange("language", e.target.value)}
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Auto-save Queries</label>
                    <p className="text-sm text-gray-500">Automatically save your queries to history</p>
                  </div>
                  <Button
                    variant={settings.autoSave ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingChange("autoSave", !settings.autoSave)}
                  >
                    {settings.autoSave ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Notifications</label>
                    <p className="text-sm text-gray-500">Receive notifications for query results</p>
                  </div>
                  <Button
                    variant={settings.notifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingChange("notifications", !settings.notifications)}
                  >
                    {settings.notifications ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Query completion alerts</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Connection status updates</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error notifications</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {themes.map(theme => {
                    const Icon = theme.icon;
                    return (
                      <div
                        key={theme.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          settings.theme === theme.value
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleSettingChange("theme", theme.value)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{theme.label}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {theme.value === "system" 
                            ? "Follows your system preference"
                            : `${theme.label} theme`
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Color Scheme</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500">Primary Color</label>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-blue-500 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-green-500 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-purple-500 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-orange-500 rounded border cursor-pointer"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500">Accent Color</label>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-gray-500 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-red-500 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-yellow-500 rounded border cursor-pointer"></div>
                      <div className="w-8 h-8 bg-pink-500 rounded border cursor-pointer"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Configuration
                </CardTitle>
                <CardDescription>
                  Configure database connection and query settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Query Timeout (seconds)</label>
                    <Input
                      type="number"
                      value={settings.queryTimeout}
                      onChange={(e) => handleSettingChange("queryTimeout", parseInt(e.target.value))}
                      min="5"
                      max="300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max Results</label>
                    <Input
                      type="number"
                      value={settings.maxResults}
                      onChange={(e) => handleSettingChange("maxResults", parseInt(e.target.value))}
                      min="100"
                      max="10000"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Query History</label>
                    <p className="text-sm text-gray-500">Save and manage query history</p>
                  </div>
                  <Button
                    variant={settings.enableQueryHistory ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingChange("enableQueryHistory", !settings.enableQueryHistory)}
                  >
                    {settings.enableQueryHistory ? "Enabled" : "Disabled"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Analytics</label>
                    <p className="text-sm text-gray-500">Share usage analytics to improve the service</p>
                  </div>
                  <Button
                    variant={settings.enableAnalytics ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSettingChange("enableAnalytics", !settings.enableAnalytics)}
                  >
                    {settings.enableAnalytics ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>
                  Security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Encrypt stored credentials</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-logout after inactivity</span>
                    <Badge variant="outline">30 minutes</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-factor authentication</span>
                    <Badge variant="secondary">Not enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <Input
                    value={userProfile.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Input
                    value={userProfile.role}
                    onChange={(e) => handleProfileChange("role", e.target.value)}
                    placeholder="Enter your role"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Organization</label>
                  <Input
                    value={userProfile.organization}
                    onChange={(e) => handleProfileChange("organization", e.target.value)}
                    placeholder="Enter your organization"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">API Endpoint</label>
                <Input
                  value={settings.apiEndpoint}
                  onChange={(e) => handleSettingChange("apiEndpoint", e.target.value)}
                  placeholder="Enter API endpoint URL"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button>Save Changes</Button>
                <Button variant="outline">Reset to Defaults</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 