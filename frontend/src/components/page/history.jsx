"use client";

import { useState, useEffect } from "react";
import { History, Search, Filter, Trash2, Copy, Eye, Calendar, Database, Server } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function QueryHistory() {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedQuery, setSelectedQuery] = useState(null);

  useEffect(() => {
    // Simulate loading query history
    const mockQueries = [
      {
        id: 1,
        type: "SQL",
        query: "SELECT users WHERE signup_date > '2024-01-01'",
        naturalLanguage: "Find all users who signed up after January 1st, 2024",
        timestamp: "2024-01-15T10:30:00Z",
        status: "success",
        resultCount: 45,
        database: "production_users"
      },
      {
        id: 2,
        type: "MongoDB",
        query: "Find users with age > 25",
        naturalLanguage: "Show me all users older than 25 years",
        timestamp: "2024-01-15T09:15:00Z",
        status: "success",
        resultCount: 123,
        database: "user_analytics"
      },
      {
        id: 3,
        type: "SQL",
        query: "COUNT orders by status",
        naturalLanguage: "Count all orders grouped by their status",
        timestamp: "2024-01-14T16:45:00Z",
        status: "success",
        resultCount: 5,
        database: "ecommerce_db"
      },
      {
        id: 4,
        type: "MongoDB",
        query: "Find products with price > 100",
        naturalLanguage: "Get all products that cost more than $100",
        timestamp: "2024-01-14T14:20:00Z",
        status: "error",
        resultCount: 0,
        database: "product_catalog"
      },
      {
        id: 5,
        type: "SQL",
        query: "SELECT * FROM customers WHERE country = 'USA'",
        naturalLanguage: "Show me all customers from the United States",
        timestamp: "2024-01-13T11:30:00Z",
        status: "success",
        resultCount: 89,
        database: "customer_data"
      }
    ];
    setQueries(mockQueries);
    setFilteredQueries(mockQueries);
  }, []);

  useEffect(() => {
    let filtered = queries;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(query =>
        query.naturalLanguage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
        query.database.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedFilter !== "all") {
      filtered = filtered.filter(query => query.type.toLowerCase() === selectedFilter.toLowerCase());
    }

    setFilteredQueries(filtered);
  }, [searchTerm, selectedFilter, queries]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const deleteQuery = (id) => {
    setQueries(queries.filter(query => query.id !== id));
  };

  const getStatusColor = (status) => {
    return status === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <History className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Query History</h1>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find specific queries from your history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search queries, natural language, or database names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                onClick={() => setSelectedFilter("all")}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                All
              </Button>
              <Button
                variant={selectedFilter === "sql" ? "default" : "outline"}
                onClick={() => setSelectedFilter("sql")}
                className="flex items-center gap-2"
              >
                <Database className="h-4 w-4" />
                SQL
              </Button>
              <Button
                variant={selectedFilter === "mongodb" ? "default" : "outline"}
                onClick={() => setSelectedFilter("mongodb")}
                className="flex items-center gap-2"
              >
                <Server className="h-4 w-4" />
                MongoDB
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Query List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Query List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Queries ({filteredQueries.length})</CardTitle>
              <CardDescription>Click on a query to view details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredQueries.map((query) => (
                  <div
                    key={query.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedQuery?.id === query.id ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedQuery(query)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={query.type === "SQL" ? "default" : "secondary"}>
                        {query.type}
                      </Badge>
                      <Badge className={getStatusColor(query.status)}>
                        {query.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mb-1 line-clamp-2">
                      {query.naturalLanguage}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {query.database}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(query.timestamp)}
                      </span>
                      <span>{query.resultCount} results</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Query Details */}
        <div className="lg:col-span-2">
          {selectedQuery ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Query Details</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedQuery.query)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Query
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteQuery(selectedQuery.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Executed on {formatDate(selectedQuery.timestamp)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="query">Generated Query</TabsTrigger>
                    <TabsTrigger value="natural">Natural Language</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Database Type</label>
                          <p className="text-sm">{selectedQuery.type}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Database Name</label>
                          <p className="text-sm">{selectedQuery.database}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <Badge className={getStatusColor(selectedQuery.status)}>
                            {selectedQuery.status}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Results</label>
                          <p className="text-sm">{selectedQuery.resultCount} records</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="query">
                    <div className="bg-gray-900 text-white p-4 rounded-lg">
                      <pre className="text-sm overflow-x-auto">{selectedQuery.query}</pre>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="natural">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm">{selectedQuery.naturalLanguage}</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a query from the list to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 