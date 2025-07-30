"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Database, Activity, Target, Zap, Globe, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [analytics, setAnalytics] = useState({
    overview: {
      totalQueries: 1247,
      successRate: 94.2,
      avgResponseTime: 1.8,
      activeUsers: 156,
      databasesConnected: 23,
      queriesToday: 89
    },
    performance: {
      responseTime: [2.1, 1.9, 1.7, 1.8, 1.6, 1.5, 1.8],
      successRate: [92, 94, 96, 93, 95, 97, 94],
      queriesPerHour: [12, 15, 18, 14, 16, 19, 17]
    },
    topQueries: [
      { query: "SELECT users WHERE signup_date > '2024-01-01'", count: 45, avgTime: 1.2 },
      { query: "Find all orders by status", count: 38, avgTime: 0.8 },
      { query: "COUNT products by category", count: 32, avgTime: 0.6 },
      { query: "Get top customers by spending", count: 28, avgTime: 2.1 },
      { query: "Find users with age > 25", count: 25, avgTime: 0.9 }
    ],
    databaseUsage: [
      { name: "Production MySQL", queries: 456, avgTime: 1.5, status: "healthy" },
      { name: "Analytics MongoDB", queries: 234, avgTime: 0.8, status: "healthy" },
      { name: "Staging PostgreSQL", queries: 189, avgTime: 2.1, status: "warning" },
      { name: "Archive SQLite", queries: 67, avgTime: 3.2, status: "critical" }
    ],
    userActivity: [
      { user: "john.doe@company.com", queries: 89, lastActive: "2 minutes ago", status: "online" },
      { user: "sarah.smith@company.com", queries: 67, lastActive: "5 minutes ago", status: "online" },
      { user: "mike.johnson@company.com", queries: 45, lastActive: "15 minutes ago", status: "away" },
      { user: "lisa.wang@company.com", queries: 34, lastActive: "1 hour ago", status: "offline" }
    ]
  });

  const timeRanges = [
    { value: "1h", label: "Last Hour" },
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy": return "🟢";
      case "warning": return "🟡";
      case "critical": return "🔴";
      default: return "⚪";
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
   
  };

  const handleOverviewCardClick = (metric) => {
    
  };

  const handleDatabaseClick = (database) => {
   
  };

  const handleQueryClick = (query) => {
   
  };

  const handleUserClick = (user) => {
    
  };

  const handleAlertClick = (alert) => {
 
  };

  const handleExportData = () => {
   
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Real-time insights and performance metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleTimeRangeChange(range.value)}
            >
              {range.label}
            </Button>
          ))}
          <Button variant="outline" size="sm" onClick={handleExportData}>
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleOverviewCardClick("total queries")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.totalQueries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleOverviewCardClick("success rate")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last period
            </p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleOverviewCardClick("response time")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.avgResponseTime}s</div>
            <p className="text-xs text-muted-foreground">
              -0.3s from last period
            </p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleOverviewCardClick("active users")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.overview.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="usage">Database Usage</TabsTrigger>
          <TabsTrigger value="queries">Top Queries</TabsTrigger>
          <TabsTrigger value="users">User Activity</TabsTrigger>
        </TabsList>

        {/* Performance Metrics */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Response Time Trend
                </CardTitle>
                <CardDescription>Average query response time over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performance.responseTime.map((time, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded cursor-pointer"
                      onClick={() => console.log(`Clicked on day ${index + 1} response time: ${time}s`)}
                    >
                      <span className="text-sm">Day {index + 1}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(time / 4) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{time}s</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Success Rate
                </CardTitle>
                <CardDescription>Query success rate over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performance.successRate.map((rate, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded cursor-pointer"
                      onClick={() => console.log(`Clicked on day ${index + 1} success rate: ${rate}%`)}
                    >
                      <span className="text-sm">Day {index + 1}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${rate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Queries per Hour
                </CardTitle>
                <CardDescription>Query volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performance.queriesPerHour.map((count, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded cursor-pointer"
                      onClick={() => console.log(`Clicked on hour ${index + 1} queries: ${count}`)}
                    >
                      <span className="text-sm">Hour {index + 1}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(count / 20) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Database Usage */}
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Database Performance Overview</CardTitle>
              <CardDescription>Real-time database health and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.databaseUsage.map((db, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => handleDatabaseClick(db)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getStatusIcon(db.status)}</span>
                      <div>
                        <h3 className="font-medium">{db.name}</h3>
                        <p className="text-sm text-gray-500">{db.queries} queries today</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{db.avgTime}s avg</p>
                        <p className="text-xs text-gray-500">response time</p>
                      </div>
                      <Badge className={getStatusColor(db.status)}>
                        {db.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Queries */}
        <TabsContent value="queries">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Queries</CardTitle>
              <CardDescription>Frequently used queries and their performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topQueries.map((query, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => handleQueryClick(query)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <Badge variant="outline">{query.count} times</Badge>
                      </div>
                      <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {query.query}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-medium">{query.avgTime}s</p>
                      <p className="text-xs text-gray-500">avg time</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Activity */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>Real-time user activity and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.userActivity.map((user, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => handleUserClick(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{user.user}</h3>
                        <p className="text-sm text-gray-500">{user.queries} queries today</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{user.lastActive}</p>
                      <Badge variant={user.status === "online" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alerts */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div 
                className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                onClick={() => handleAlertClick("High response time detected")}
              >
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">High response time detected</p>
                  <p className="text-xs text-yellow-600">Archive SQLite database showing 3.2s average response time</p>
                </div>
              </div>
              <div 
                className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                onClick={() => handleAlertClick("Performance improvement")}
              >
                <Clock className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Performance improvement</p>
                  <p className="text-xs text-green-600">Average response time improved by 15% this week</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 