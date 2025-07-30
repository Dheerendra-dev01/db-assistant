"use client";

import { useState } from "react";
import { Shield, Zap, Globe, Lock, Users, Database, Code, Settings, Key, Activity, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Enterprise() {
  const [activeTab, setActiveTab] = useState("overview");

  const [enterprise, setEnterprise] = useState({
    overview: {
      totalUsers: 1250,
      activeIntegrations: 15,
      apiCalls: 45000,
      uptime: 99.99,
      securityScore: 98,
      complianceStatus: "compliant"
    },
    integrations: [
      {
        id: 1,
        name: "Slack",
        description: "Real-time notifications and alerts",
        status: "active",
        lastSync: "2 minutes ago",
        type: "communication"
      },
      {
        id: 2,
        name: "Salesforce",
        description: "CRM data integration and sync",
        status: "active",
        lastSync: "5 minutes ago",
        type: "crm"
      },
      {
        id: 3,
        name: "Tableau",
        description: "Advanced analytics and visualization",
        status: "configuring",
        lastSync: "1 hour ago",
        type: "analytics"
      },
      {
        id: 4,
        name: "Jira",
        description: "Project management integration",
        status: "active",
        lastSync: "10 minutes ago",
        type: "project"
      }
    ],
    apiKeys: [
      {
        id: 1,
        name: "Production API Key",
        key: "sk-prod-...abc123",
        permissions: ["read", "write"],
        lastUsed: "2 minutes ago",
        status: "active"
      },
      {
        id: 2,
        name: "Development API Key",
        key: "sk-dev-...xyz789",
        permissions: ["read"],
        lastUsed: "1 hour ago",
        status: "active"
      },
      {
        id: 3,
        name: "Analytics API Key",
        key: "sk-analytics-...def456",
        permissions: ["read", "analytics"],
        lastUsed: "3 hours ago",
        status: "inactive"
      }
    ],
    security: {
      features: [
        { name: "Two-Factor Authentication", status: "enabled", users: 1250 },
        { name: "SSO Integration", status: "enabled", users: 1250 },
        { name: "IP Whitelisting", status: "enabled", users: 1250 },
        { name: "Audit Logging", status: "enabled", users: 1250 },
        { name: "Data Encryption", status: "enabled", users: 1250 },
        { name: "Role-Based Access", status: "enabled", users: 1250 }
      ],
      compliance: [
        { standard: "SOC 2 Type II", status: "certified", expiry: "2024-12-31" },
        { standard: "GDPR", status: "compliant", expiry: "ongoing" },
        { standard: "HIPAA", status: "certified", expiry: "2024-06-30" },
        { standard: "ISO 27001", status: "in-progress", expiry: "2024-09-15" }
      ]
    },
    usage: {
      apiCalls: {
        total: 45000,
        successful: 44850,
        failed: 150,
        rateLimit: 100000
      },
      storage: {
        used: 85.6,
        total: 100,
        unit: "GB"
      },
      databases: {
        connected: 23,
        active: 20,
        total: 25
      }
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "configuring": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      case "compliant": return "bg-green-100 text-green-800";
      case "certified": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getIntegrationIcon = (type) => {
    switch (type) {
      case "communication": return "💬";
      case "crm": return "👥";
      case "analytics": return "📊";
      case "project": return "📋";
      default: return "🔗";
    }
  };

  const handleOverviewCardClick = (metric) => {
    console.log(`Clicked on ${metric} overview card`);
    alert(`Viewing detailed ${metric} analytics...`);
  };

  const handleIntegrationClick = (integration) => {
    console.log(`Clicked on integration: ${integration.name}`);
    alert(`Opening integration details for ${integration.name}`);
  };

  const handleApiKeyRegenerateClick = (apiKey) => {
    console.log(`Regenerating API key: ${apiKey.name}`);
    alert(`Regenerating API key: ${apiKey.name}`);
  };

  const handleApiKeySettingsClick = (apiKey) => {
    console.log(`Opening settings for API key: ${apiKey.name}`);
    alert(`Opening settings for API key: ${apiKey.name}`);
  };

  const handleSecurityFeatureClick = (feature) => {
    console.log(`Clicked on security feature: ${feature.name}`);
    alert(`Opening security feature: ${feature.name}`);
  };

  const handleComplianceClick = (compliance) => {
    console.log(`Clicked on compliance: ${compliance.standard}`);
    alert(`Opening compliance details for ${compliance.standard}`);
  };

  const handleUsageCardClick = (metric) => {
    console.log(`Clicked on usage metric: ${metric}`);
    alert(`Viewing detailed ${metric} usage...`);
  };

  const handleExportReport = () => {
    console.log("Exporting enterprise report");
    alert("Exporting enterprise report to PDF...");
  };

  const handleContactSupport = () => {
    console.log("Contacting enterprise support");
    alert("Opening enterprise support chat...");
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Enterprise Features</h1>
            <p className="text-gray-600 dark:text-gray-400">Advanced capabilities for enterprise teams</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Enterprise Plan
          </Badge>
          <Button variant="outline" size="sm" onClick={handleContactSupport}>
            Contact Support
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleOverviewCardClick("total users")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enterprise.overview.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleOverviewCardClick("API calls")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enterprise.overview.apiCalls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleOverviewCardClick("uptime")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enterprise.overview.uptime}%</div>
            <p className="text-xs text-muted-foreground">
              SLA compliance
            </p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleOverviewCardClick("security score")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enterprise.overview.securityScore}/100</div>
            <p className="text-xs text-muted-foreground">
              Excellent rating
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="api">API Management</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleUsageCardClick("database")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Overview
                </CardTitle>
                <CardDescription>Connected databases and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Connected Databases</span>
                    <span className="font-medium">{enterprise.usage.databases.connected}/{enterprise.usage.databases.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Connections</span>
                    <span className="font-medium">{enterprise.usage.databases.active}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(enterprise.usage.databases.connected / enterprise.usage.databases.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleUsageCardClick("system health")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  System Health
                </CardTitle>
                <CardDescription>Overall system performance and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Success Rate</span>
                    <span className="font-medium">
                      {Math.round((enterprise.usage.apiCalls.successful / enterprise.usage.apiCalls.total) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Usage</span>
                    <span className="font-medium">{enterprise.usage.storage.used}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rate Limit Usage</span>
                    <span className="font-medium">
                      {Math.round((enterprise.usage.apiCalls.total / enterprise.usage.apiCalls.rateLimit) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Third-Party Integrations
              </CardTitle>
              <CardDescription>Connect with your favorite tools and services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {enterprise.integrations.map((integration) => (
                  <div 
                    key={integration.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => handleIntegrationClick(integration)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getIntegrationIcon(integration.type)}</span>
                      <div>
                        <h3 className="font-medium">{integration.name}</h3>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{integration.lastSync}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Management Tab */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                API Key Management
              </CardTitle>
              <CardDescription>Manage your API keys and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enterprise.apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{apiKey.name}</h3>
                        <Badge className={getStatusColor(apiKey.status)}>
                          {apiKey.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-mono text-gray-500 mb-2">{apiKey.key}</p>
                      <div className="flex items-center gap-2">
                        {apiKey.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{apiKey.lastUsed}</p>
                      <div className="flex gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleApiKeyRegenerateClick(apiKey)}
                        >
                          <Key className="h-4 w-4 mr-2" />
                          Regenerate
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleApiKeySettingsClick(apiKey)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Features
                </CardTitle>
                <CardDescription>Enabled security measures and configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {enterprise.security.features.map((feature) => (
                    <div 
                      key={feature.name} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => handleSecurityFeatureClick(feature)}
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{feature.name}</span>
                      </div>
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Compliance & Certifications
                </CardTitle>
                <CardDescription>Security standards and compliance status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {enterprise.security.compliance.map((item) => (
                    <div 
                      key={item.standard} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => handleComplianceClick(item)}
                    >
                      <div>
                        <span className="text-sm font-medium">{item.standard}</span>
                        <p className="text-xs text-gray-500">Expires: {item.expiry}</p>
                      </div>
                      <Badge className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleUsageCardClick("API usage")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  API Usage
                </CardTitle>
                <CardDescription>API call statistics and limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Calls</span>
                    <span className="font-medium">{enterprise.usage.apiCalls.total.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Successful</span>
                    <span className="font-medium text-green-600">{enterprise.usage.apiCalls.successful.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Failed</span>
                    <span className="font-medium text-red-600">{enterprise.usage.apiCalls.failed}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${(enterprise.usage.apiCalls.total / enterprise.usage.apiCalls.rateLimit) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">Rate limit: {enterprise.usage.apiCalls.rateLimit.toLocaleString()}/month</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleUsageCardClick("storage usage")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Storage Usage
                </CardTitle>
                <CardDescription>Data storage and backup information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Used Storage</span>
                    <span className="font-medium">{enterprise.usage.storage.used} {enterprise.usage.storage.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Storage</span>
                    <span className="font-medium">{enterprise.usage.storage.total} {enterprise.usage.storage.unit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${enterprise.usage.storage.used}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">85.6% of storage used</p>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleUsageCardClick("user activity")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Activity
                </CardTitle>
                <CardDescription>Team usage and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Users</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Queries Today</span>
                    <span className="font-medium">2,156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Session</span>
                    <span className="font-medium">45 min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                  <p className="text-xs text-gray-500">78% user engagement rate</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Enterprise Actions</CardTitle>
            <CardDescription>Quick access to enterprise features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={handleExportReport}>
                Export Report
              </Button>
              <Button variant="outline" onClick={handleContactSupport}>
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 