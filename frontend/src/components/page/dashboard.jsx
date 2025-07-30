"use client";

import { useState, useEffect } from "react";
import { Database, Server, History, Settings, HelpCircle, BarChart3, Users, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalQueries: 0,
    successfulQueries: 0,
    activeConnections: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalQueries: 156,
      successfulQueries: 142,
      activeConnections: 2,
      recentActivity: [
        { type: "SQL", query: "SELECT users WHERE signup_date > '2024-01-01'", timestamp: "2 minutes ago" },
        { type: "MongoDB", query: "Find users with age > 25", timestamp: "5 minutes ago" },
        { type: "SQL", query: "COUNT orders by status", timestamp: "10 minutes ago" }
      ]
    });
  }, []);

  const quickActions = [
    {
      title: "SQL Query",
      description: "Query your SQL database with natural language",
      icon: Database,
      href: "/sql",
      color: "bg-blue-500"
    },
    {
      title: "MongoDB Query",
      description: "Query your MongoDB with natural language",
      icon: Server,
      href: "/mongo",
      color: "bg-green-500"
    },
    {
      title: "Query History",
      description: "View and manage your past queries",
      icon: History,
      href: "/history",
      color: "bg-purple-500"
    },
    {
      title: "Database Management",
      description: "Manage your database connections",
      icon: Settings,
      href: "/manage",
      color: "bg-orange-500"
    }
  ];

  const handleQuickActionClick = (action) => {
    console.log(`Navigating to ${action.title}`);
    // In a real app, this would navigate to the page
    
  };

  const handleStatsCardClick = (metric) => {
    
  };

  const handleActivityClick = (activity) => {
   
  };

  const handleDocumentationClick = () => {
   
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Database Assistant</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Your intelligent companion for database queries and management
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleStatsCardClick("total queries")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQueries}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleStatsCardClick("success rate")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats.successfulQueries / stats.totalQueries) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.successfulQueries} successful queries
            </p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleStatsCardClick("active connections")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeConnections}</div>
            <p className="text-xs text-muted-foreground">
              Database connections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleQuickActionClick(action)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>Latest Queries</CardTitle>
            <CardDescription>Your most recent database queries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => handleActivityClick(activity)}
                >
                  <div className="flex items-center space-x-3">
                    <Badge variant={activity.type === "SQL" ? "default" : "secondary"}>
                      {activity.type}
                    </Badge>
                    <span className="text-sm font-medium">{activity.query}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Need Help?
            </CardTitle>
            <CardDescription>
              Learn how to use the Database Assistant effectively
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">For SQL Databases</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Connect to MySQL, PostgreSQL, or SQL Server</li>
                  <li>• Write queries in natural language</li>
                  <li>• View generated SQL and results</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">For MongoDB</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Connect using MongoDB URI</li>
                  <li>• Query collections naturally</li>
                  <li>• See generated MongoDB queries</li>
                </ul>
              </div>
            </div>
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleDocumentationClick}
              >
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 