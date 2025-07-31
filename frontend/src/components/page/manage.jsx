"use client";

import { useState, useEffect } from "react";
import { Settings, Plus, Database, Server, TestTube, Edit, Trash2, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DatabaseManagement() {
  const [connections, setConnections] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingConnection, setEditingConnection] = useState(null);
  const [testingConnection, setTestingConnection] = useState(null);

  const [newConnection, setNewConnection] = useState({
    name: "",
    type: "sql",
    host: "",
    port: "",
    username: "",
    password: "",
    database: "",
    mongoUri: ""
  });

  useEffect(() => {
    // Load saved connections from localStorage
    const savedConnections = localStorage.getItem("dbConnections");
    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    } else {
      // Mock data for demonstration
      setConnections([
        {
          id: 1,
          name: "Production Users DB",
          type: "sql",
          host: "prod-users.example.com",
          port: "3306",
          username: "app_user",
          password: "••••••••",
          database: "users_production",
          isConnected: true,
          lastTested: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          name: "Analytics MongoDB",
          type: "mongodb",
          mongoUri: "mongodb://analytics.example.com:27017",
          database: "analytics",
          isConnected: true,
          lastTested: "2024-01-15T09:15:00Z"
        },
        {
          id: 3,
          name: "Development SQL",
          type: "sql",
          host: "localhost",
          port: "5432",
          username: "dev_user",
          password: "••••••••",
          database: "dev_db",
          isConnected: false,
          lastTested: "2024-01-14T16:45:00Z"
        }
      ]);
    }
  }, []);

  useEffect(() => {
    // Save connections to localStorage
    localStorage.setItem("dbConnections", JSON.stringify(connections));
  }, [connections]);

  const handleAddConnection = () => {
    if (!newConnection.name || (newConnection.type === "sql" && (!newConnection.host || !newConnection.database)) || 
        (newConnection.type === "mongodb" && !newConnection.mongoUri)) {
      return;
    }

    const connection = {
      id: Date.now(),
      ...newConnection,
      isConnected: false,
      lastTested: null
    };

    setConnections([...connections, connection]);
    setNewConnection({
      name: "",
      type: "sql",
      host: "",
      port: "",
      username: "",
      password: "",
      database: "",
      mongoUri: ""
    });
    setShowAddForm(false);
  };

  const handleEditConnection = () => {
    if (!editingConnection.name) return;

    setConnections(connections.map(conn => 
      conn.id === editingConnection.id ? editingConnection : conn
    ));
    setEditingConnection(null);
  };

  const handleDeleteConnection = (id) => {
    setConnections(connections.filter(conn => conn.id !== id));
  };

  const testConnection = async (connection) => {
    setTestingConnection(connection.id);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update connection status
      setConnections(connections.map(conn => 
        conn.id === connection.id 
          ? { ...conn, isConnected: true, lastTested: new Date().toISOString() }
          : conn
      ));
    } catch (error) {
      setConnections(connections.map(conn => 
        conn.id === connection.id 
          ? { ...conn, isConnected: false, lastTested: new Date().toISOString() }
          : conn
      ));
    } finally {
      setTestingConnection(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never tested";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getConnectionIcon = (type) => {
    return type === "sql" ? Database : Server;
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Database Management</h1>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Connection
        </Button>
      </div>

      {/* Add/Edit Connection Form */}
      {(showAddForm || editingConnection) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingConnection ? "Edit Connection" : "Add New Connection"}
            </CardTitle>
            <CardDescription>
              Configure your database connection settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Connection Name"
                value={editingConnection?.name || newConnection.name}
                onChange={(e) => {
                  if (editingConnection) {
                    setEditingConnection({ ...editingConnection, name: e.target.value });
                  } else {
                    setNewConnection({ ...newConnection, name: e.target.value });
                  }
                }}
              />
              
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={editingConnection?.type || newConnection.type}
                  onChange={(e) => {
                    if (editingConnection) {
                      setEditingConnection({ ...editingConnection, type: e.target.value });
                    } else {
                      setNewConnection({ ...newConnection, type: e.target.value });
                    }
                  }}
                >
                  <option value="sql">SQL Database</option>
                  <option value="mongodb">MongoDB</option>
                </select>
              </div>

              {(editingConnection?.type || newConnection.type) === "sql" ? (
                <>
                  <Input
                    placeholder="Host"
                    value={editingConnection?.host || newConnection.host}
                    onChange={(e) => {
                      if (editingConnection) {
                        setEditingConnection({ ...editingConnection, host: e.target.value });
                      } else {
                        setNewConnection({ ...newConnection, host: e.target.value });
                      }
                    }}
                  />
                  <Input
                    placeholder="Port"
                    value={editingConnection?.port || newConnection.port}
                    onChange={(e) => {
                      if (editingConnection) {
                        setEditingConnection({ ...editingConnection, port: e.target.value });
                      } else {
                        setNewConnection({ ...newConnection, port: e.target.value });
                      }
                    }}
                  />
                  <Input
                    placeholder="Username"
                    value={editingConnection?.username || newConnection.username}
                    onChange={(e) => {
                      if (editingConnection) {
                        setEditingConnection({ ...editingConnection, username: e.target.value });
                      } else {
                        setNewConnection({ ...newConnection, username: e.target.value });
                      }
                    }}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={editingConnection?.password || newConnection.password}
                    onChange={(e) => {
                      if (editingConnection) {
                        setEditingConnection({ ...editingConnection, password: e.target.value });
                      } else {
                        setNewConnection({ ...newConnection, password: e.target.value });
                      }
                    }}
                  />
                  <Input
                    placeholder="Database Name"
                    value={editingConnection?.database || newConnection.database}
                    onChange={(e) => {
                      if (editingConnection) {
                        setEditingConnection({ ...editingConnection, database: e.target.value });
                      } else {
                        setNewConnection({ ...newConnection, database: e.target.value });
                      }
                    }}
                  />
                </>
              ) : (
                <div className="md:col-span-2">
                  <Input
                    placeholder="MongoDB URI"
                    value={editingConnection?.mongoUri || newConnection.mongoUri}
                    onChange={(e) => {
                      if (editingConnection) {
                        setEditingConnection({ ...editingConnection, mongoUri: e.target.value });
                      } else {
                        setNewConnection({ ...newConnection, mongoUri: e.target.value });
                      }
                    }}
                  />
                </div>
              )}

              <div className="md:col-span-2 flex gap-2">
                <Button 
                  onClick={editingConnection ? handleEditConnection : handleAddConnection}
                  className="flex-1"
                >
                  {editingConnection ? "Update Connection" : "Add Connection"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingConnection(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connections List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection) => {
          const Icon = getConnectionIcon(connection.type);
          return (
            <Card key={connection.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{connection.name}</CardTitle>
                  </div>
                  <Badge variant={connection.isConnected ? "default" : "secondary"}>
                    {connection.isConnected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <CardDescription>
                  {connection.type === "sql" 
                    ? `${connection.host}:${connection.port}/${connection.database}`
                    : connection.mongoUri
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Last Tested:</span>
                    <span>{formatDate(connection.lastTested)}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testConnection(connection)}
                      disabled={testingConnection === connection.id}
                      className="flex-1"
                    >
                      {testingConnection === connection.id ? (
                        <>
                          <TestTube className="h-4 w-4 mr-2 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        <>
                          <TestTube className="h-4 w-4 mr-2" />
                          Test
                        </>
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingConnection(connection)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteConnection(connection.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {connections.length === 0 && !showAddForm && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No connections yet</h3>
            <p className="text-gray-500 mb-4">Add your first database connection to get started</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Connection
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 