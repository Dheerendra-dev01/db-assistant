"use client";

import { useState } from "react";
import { Home, Database, Server, History, Settings, HelpCircle, Menu, X, BarChart3, FolderOpen, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Navigation({ currentPage, onPageChange }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      description: "Overview and quick actions"
    },
    {
      id: "sql",
      label: "SQL Query",
      icon: Database,
      description: "Natural language SQL queries"
    },
    {
      id: "mongo",
      label: "MongoDB Query",
      icon: Server,
      description: "Natural language MongoDB queries"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "Performance metrics and insights"
    },
    {
      id: "workspace",
      label: "Workspace",
      icon: FolderOpen,
      description: "Collaborative projects and teams"
    },
    {
      id: "history",
      label: "Query History",
      icon: History,
      description: "View and manage past queries"
    },
    {
      id: "manage",
      label: "Database Management",
      icon: Settings,
      description: "Manage database connections"
    },
    {
      id: "enterprise",
      label: "Enterprise",
      icon: Shield,
      description: "Advanced features and integrations"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Application configuration"
    },
    {
      id: "help",
      label: "Help & Docs",
      icon: HelpCircle,
      description: "Documentation and support"
    }
  ];

  const handlePageChange = (pageId) => {
    onPageChange(pageId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                DB Assistant
              </h1>
            </div>

            {/* Navigation Items */}
            <div className="hidden lg:flex lg:items-center lg:space-x-2 lg:flex-1 lg:justify-center">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePageChange(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                      currentPage === item.id
                        ? "bg-primary text-white"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Badge variant="outline" className="hidden sm:inline-flex bg-green-50 text-green-700 border-green-200">
                Enterprise
              </Badge>
              <Badge variant="outline" className="hidden sm:inline-flex">
                v2.0.0
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
                DB Assistant
              </h1>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 max-h-96 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePageChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      currentPage === item.id
                        ? "bg-primary text-white"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div>{item.label}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
} 