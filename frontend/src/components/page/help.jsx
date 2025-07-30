"use client";

import { useState } from "react";
import { HelpCircle, Book, Video, MessageCircle, Search, Database, Server, Code, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const quickStartGuide = [
    {
      step: 1,
      title: "Connect to Your Database",
      description: "Navigate to the Database Management page and add your database connection details.",
      icon: Database
    },
    {
      step: 2,
      title: "Choose Your Query Type",
      description: "Select between SQL or MongoDB query pages based on your database type.",
      icon: Server
    },
    {
      step: 3,
      title: "Write Natural Language Queries",
      description: "Describe what you want to find in plain English instead of writing complex queries.",
      icon: MessageCircle
    },
    {
      step: 4,
      title: "Review and Execute",
      description: "Review the generated query and execute it to see your results.",
      icon: CheckCircle
    }
  ];

  const sqlExamples = [
    {
      natural: "Find all users who signed up in the last month",
      sql: "SELECT * FROM users WHERE signup_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)",
      category: "Filtering"
    },
    {
      natural: "Count orders by status",
      sql: "SELECT status, COUNT(*) as count FROM orders GROUP BY status",
      category: "Aggregation"
    },
    {
      natural: "Get the top 10 customers by total spending",
      sql: "SELECT customer_id, SUM(amount) as total_spent FROM orders GROUP BY customer_id ORDER BY total_spent DESC LIMIT 10",
      category: "Sorting"
    },
    {
      natural: "Find products with low stock",
      sql: "SELECT * FROM products WHERE stock_quantity < 10",
      category: "Filtering"
    }
  ];

  const mongoExamples = [
    {
      natural: "Find all users older than 25",
      mongo: "db.users.find({ age: { $gt: 25 } })",
      category: "Filtering"
    },
    {
      natural: "Count documents by category",
      mongo: "db.products.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }])",
      category: "Aggregation"
    },
    {
      natural: "Find products with price between 50 and 100",
      mongo: "db.products.find({ price: { $gte: 50, $lte: 100 } })",
      category: "Range Queries"
    },
    {
      natural: "Get the most recent orders",
      mongo: "db.orders.find().sort({ created_at: -1 }).limit(10)",
      category: "Sorting"
    }
  ];

  const faqs = [
    {
      question: "What databases are supported?",
      answer: "Currently, we support MySQL, PostgreSQL, SQL Server for SQL databases, and MongoDB for NoSQL databases. More database types will be added in future updates."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take security seriously. Database credentials are encrypted and never stored in plain text. All connections are made directly from your browser to your database."
    },
    {
      question: "Can I save my queries?",
      answer: "Yes! All your queries are automatically saved to the Query History page where you can view, search, and reuse them later."
    },
    {
      question: "What if my query doesn't work?",
      answer: "If a query fails, check the error message for details. Common issues include incorrect table/collection names, missing permissions, or syntax errors in the natural language description."
    },
    {
      question: "Can I export my results?",
      answer: "Currently, results are displayed in the browser. Export functionality will be available in a future update."
    }
  ];

  const troubleshooting = [
    {
      issue: "Connection failed",
      solutions: [
        "Verify your database credentials are correct",
        "Check if your database server is running",
        "Ensure your IP address is whitelisted",
        "Verify the port number is correct"
      ]
    },
    {
      issue: "Query returns no results",
      solutions: [
        "Check if the table/collection name is correct",
        "Verify your natural language description is clear",
        "Try a simpler query first",
        "Check if the data exists in your database"
      ]
    },
    {
      issue: "Query times out",
      solutions: [
        "Try a more specific query to reduce result size",
        "Check if your database is under heavy load",
        "Verify your network connection",
        "Consider adding indexes to improve performance"
      ]
    }
  ];

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <HelpCircle className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Help & Documentation</h1>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search help articles, examples, or troubleshooting..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="quickstart" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Quick Start Guide */}
        <TabsContent value="quickstart">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Quick Start Guide
                </CardTitle>
                <CardDescription>
                  Get up and running with Database Assistant in 4 simple steps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {quickStartGuide.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">{step.title}</h3>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Video className="h-12 w-12 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">Video Tutorials</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Watch step-by-step video guides</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Code className="h-12 w-12 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">API Documentation</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Integrate with our API</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-3 text-primary" />
                    <h3 className="font-semibold mb-2">Community</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Join our community forum</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Examples */}
        <TabsContent value="examples">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  SQL Examples
                </CardTitle>
                <CardDescription>
                  Common SQL query patterns and their natural language equivalents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sqlExamples.map((example, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{example.category}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Natural Language:</label>
                          <p className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">"{example.natural}"</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Generated SQL:</label>
                          <pre className="text-sm bg-gray-900 text-white p-2 rounded overflow-x-auto">{example.sql}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  MongoDB Examples
                </CardTitle>
                <CardDescription>
                  Common MongoDB query patterns and their natural language equivalents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mongoExamples.map((example, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{example.category}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Natural Language:</label>
                          <p className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded">"{example.natural}"</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Generated MongoDB Query:</label>
                          <pre className="text-sm bg-gray-900 text-white p-2 rounded overflow-x-auto">{example.mongo}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions and their answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Troubleshooting */}
        <TabsContent value="troubleshooting">
          <div className="space-y-6">
            {troubleshooting.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    {item.issue}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {item.solutions.map((solution, solutionIndex) => (
                      <div key={solutionIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{solution}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contact */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
              <CardDescription>
                Can't find what you're looking for? Get in touch with our support team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Contact Options</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">support@db-assistant.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Book className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Documentation</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">docs.db-assistant.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Video Tutorials</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">youtube.com/db-assistant</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Response Times</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Email Support</span>
                      <Badge variant="outline">24 hours</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Documentation</span>
                      <Badge variant="outline">Instant</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Community Forum</span>
                      <Badge variant="outline">2-4 hours</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 