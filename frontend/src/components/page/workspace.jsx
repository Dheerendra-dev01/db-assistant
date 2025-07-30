"use client";

import { useState, useEffect } from "react";
import { Users, FolderOpen, FileText, Share2, Star, Clock, MessageSquare, Zap, Plus, Search, Filter, Edit, Trash2, Archive, UserPlus, X, Copy, ThumbsUp, GitFork, Mail, UserMinus, Bell, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import projectApi from "../../api/projectApi";
import templateApi from "../../api/templateApi";
import teamApi from "../../api/teamApi";
import activityApi from "../../api/activityApi";

export default function Workspace() {
  const [activeTab, setActiveTab] = useState("projects");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Project management states
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  // Template management states
  const [templates, setTemplates] = useState([]);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false);
  const [showViewTemplateModal, setShowViewTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateSearchTerm, setTemplateSearchTerm] = useState("");
  const [templateFilterCategory, setTemplateFilterCategory] = useState("all");
  const [templateFilterType, setTemplateFilterType] = useState("all");

  // Team management states
  const [teams, setTeams] = useState([]);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamSearchTerm, setTeamSearchTerm] = useState("");

  // Activity management states
  const [activities, setActivities] = useState([]);
  const [activityStats, setActivityStats] = useState({});
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);
  const [showViewActivityModal, setShowViewActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activitySearchTerm, setActivitySearchTerm] = useState("");
  const [activityFilterType, setActivityFilterType] = useState("all");
  const [activityFilterPriority, setActivityFilterPriority] = useState("all");

  // Form states
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    type: "other",
    tags: "",
    settings: {
      isPublic: false,
      allowComments: true,
      autoBackup: true
    }
  });

  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: "",
    category: "other",
    query: "",
    queryType: "sql",
    isPublic: false,
    tags: "",
    settings: {
      allowComments: true,
      allowForking: true,
      requireApproval: false
    }
  });

  const [teamForm, setTeamForm] = useState({
    name: "",
    description: "",
    members: []
  });

  const [teamMemberForm, setTeamMemberForm] = useState({
    name: "",
    email: "",
    role: "Member"
  });

  const [activityForm, setActivityForm] = useState({
    type: "user",
    title: "",
    description: "",
    priority: "medium",
    project: "",
    template: "",
    team: ""
  });

  // Load projects, templates, teams, and activities on component mount
  useEffect(() => {
    loadProjects();
    loadTemplates();
    loadTeams();
    loadActivities();
    loadActivityStats();
  }, []);

  // Load projects from API
  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterType !== "all") params.type = filterType;

      const response = await projectApi.getProjects(params);
      if (response.success) {
        setProjects(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load projects");
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  // Create new project
  const handleCreateProject = async () => {
    if (!projectForm.name || !projectForm.description) {
      setError("Name and description are required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const projectData = {
        ...projectForm,
        tags: projectForm.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        owner: "default-user" // In real app, get from auth
      };

      const response = await projectApi.createProject(projectData);
      if (response.success) {
        setShowCreateModal(false);
        resetProjectForm();
        loadProjects(); // Reload projects
      }
    } catch (err) {
      setError(err.message || "Failed to create project");
      console.error("Error creating project:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update project
  const handleUpdateProject = async () => {
    if (!selectedProject || !projectForm.name || !projectForm.description) {
      setError("Name and description are required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updateData = {
        ...projectForm,
        tags: projectForm.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await projectApi.updateProject(selectedProject._id, updateData);
      if (response.success) {
        setShowEditModal(false);
        resetProjectForm();
        loadProjects(); // Reload projects
      }
    } catch (err) {
      setError(err.message || "Failed to update project");
      console.error("Error updating project:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.deleteProject(projectId);
      if (response.success) {
        loadProjects(); // Reload projects
      }
    } catch (err) {
      setError(err.message || "Failed to delete project");
      console.error("Error deleting project:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle star
  const handleToggleStar = async (projectId, e) => {
    e.stopPropagation();
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.toggleStar(projectId);
      if (response.success) {
        loadProjects(); // Reload projects
      }
    } catch (err) {
      setError(err.message || "Failed to toggle star");
      console.error("Error toggling star:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle archive
  const handleToggleArchive = async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.toggleArchive(projectId);
      if (response.success) {
        loadProjects(); // Reload projects
      }
    } catch (err) {
      setError(err.message || "Failed to toggle archive");
      console.error("Error toggling archive:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add member to project
  const handleAddMember = async () => {
    if (!newMemberEmail || !selectedProject) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.addMember(selectedProject._id, newMemberEmail);
      if (response.success) {
        setShowAddMemberModal(false);
        setNewMemberEmail("");
        loadProjects(); // Reload projects
      }
    } catch (err) {
      setError(err.message || "Failed to add member");
      console.error("Error adding member:", err);
    } finally {
      setLoading(false);
    }
  };

  // Remove member from project
  const handleRemoveMember = async (projectId, email) => {
    if (!confirm(`Are you sure you want to remove ${email} from this project?`)) return;

    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.removeMember(projectId, email);
      if (response.success) {
        loadProjects(); // Reload projects
      }
    } catch (err) {
      setError(err.message || "Failed to remove member");
      console.error("Error removing member:", err);
    } finally {
      setLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (project) => {
    setSelectedProject(project);
    setProjectForm({
      name: project.name,
      description: project.description,
      type: project.type,
      tags: project.tags.join(", "),
      settings: project.settings
    });
    setShowEditModal(true);
  };

  // Open add member modal
  const openAddMemberModal = (project) => {
    setSelectedProject(project);
    setShowAddMemberModal(true);
  };

  // Reset project form
  const resetProjectForm = () => {
    setProjectForm({
      name: "",
      description: "",
      type: "other",
      tags: "",
      settings: {
        isPublic: false,
        allowComments: true,
        autoBackup: true
      }
    });
    setSelectedProject(null);
  };

  // Handle search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setFilterType(filter);
  };

  // Apply search and filter
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadProjects();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterType]);

  // Load templates from API
  const loadTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (templateSearchTerm) params.search = templateSearchTerm;
      if (templateFilterCategory !== "all") params.category = templateFilterCategory;
      if (templateFilterType !== "all") params.queryType = templateFilterType;

      const response = await templateApi.getTemplates(params);
      if (response.success) {
        setTemplates(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load templates");
      console.error("Error loading templates:", err);
    } finally {
      setLoading(false);
    }
  };

  // Apply template search and filter
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadTemplates();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [templateSearchTerm, templateFilterCategory, templateFilterType]);

  // Load teams from API
  const loadTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (teamSearchTerm) params.search = teamSearchTerm;

      const response = await teamApi.getTeams(params);
      if (response.success) {
        setTeams(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load teams");
      console.error("Error loading teams:", err);
    } finally {
      setLoading(false);
    }
  };

  // Apply team search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadTeams();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [teamSearchTerm]);

  // Load activities from API
  const loadActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        user: 'default-user',
        limit: 20
      };
      if (activitySearchTerm) params.search = activitySearchTerm;
      if (activityFilterType !== 'all') params.type = activityFilterType;
      if (activityFilterPriority !== 'all') params.priority = activityFilterPriority;

      const response = await activityApi.getActivities(params);
      if (response.success) {
        setActivities(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to load activities");
      console.error("Error loading activities:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load activity statistics
  const loadActivityStats = async () => {
    try {
      const response = await activityApi.getActivityStats({ user: 'default-user' });
      if (response.success) {
        setActivityStats(response.data);
      }
    } catch (err) {
      console.error("Error loading activity stats:", err);
    }
  };

  // Apply activity search and filter
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadActivities();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [activitySearchTerm, activityFilterType, activityFilterPriority]);

  const getProjectTypeColor = (type) => {
    switch (type) {
      case "analytics": return "bg-blue-100 text-blue-800";
      case "development": return "bg-green-100 text-green-800";
      case "finance": return "bg-purple-100 text-purple-800";
      case "marketing": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "archived": return "bg-gray-100 text-gray-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  // Template management functions
  const handleCreateTemplate = async () => {
    if (!templateForm.name || !templateForm.description || !templateForm.query) {
      setError("Name, description, and query are required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const templateData = {
        ...templateForm,
        tags: templateForm.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        author: "default-user" // In real app, get from auth
      };

      const response = await templateApi.createTemplate(templateData);
      if (response.success) {
        setShowCreateTemplateModal(false);
        resetTemplateForm();
        loadTemplates(); // Reload templates
      }
    } catch (err) {
      setError(err.message || "Failed to create template");
      console.error("Error creating template:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTemplate = async () => {
    if (!selectedTemplate || !templateForm.name || !templateForm.description || !templateForm.query) {
      setError("Name, description, and query are required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updateData = {
        ...templateForm,
        tags: templateForm.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await templateApi.updateTemplate(selectedTemplate._id, updateData);
      if (response.success) {
        setShowEditTemplateModal(false);
        resetTemplateForm();
        loadTemplates(); // Reload templates
      }
    } catch (err) {
      setError(err.message || "Failed to update template");
      console.error("Error updating template:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    setLoading(true);
    setError(null);
    try {
      const response = await templateApi.deleteTemplate(templateId);
      if (response.success) {
        loadTemplates(); // Reload templates
      }
    } catch (err) {
      setError(err.message || "Failed to delete template");
      console.error("Error deleting template:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = async (templateId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await templateApi.useTemplate(templateId);
      if (response.success) {
        loadTemplates(); // Reload templates
      }
    } catch (err) {
      setError(err.message || "Failed to use template");
      console.error("Error using template:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRateTemplate = async (templateId, rating) => {
    setLoading(true);
    setError(null);
    try {
      const response = await templateApi.rateTemplate(templateId, rating);
      if (response.success) {
        loadTemplates(); // Reload templates
      }
    } catch (err) {
      setError(err.message || "Failed to rate template");
      console.error("Error rating template:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleForkTemplate = async (templateId) => {
    setLoading(true);
    setError(null);
    try {
      const forkData = {
        name: `${selectedTemplate?.name} (Fork)`,
        description: selectedTemplate?.description,
        isPublic: false,
        author: "default-user"
      };

      const response = await templateApi.forkTemplate(templateId, forkData);
      if (response.success) {
        setShowViewTemplateModal(false);
        loadTemplates(); // Reload templates
      }
    } catch (err) {
      setError(err.message || "Failed to fork template");
      console.error("Error forking template:", err);
    } finally {
      setLoading(false);
    }
  };

  const openEditTemplateModal = (template) => {
    setSelectedTemplate(template);
    setTemplateForm({
      name: template.name,
      description: template.description,
      category: template.category,
      query: template.query,
      queryType: template.queryType,
      isPublic: template.isPublic,
      tags: template.tags.join(", "),
      settings: template.settings
    });
    setShowEditTemplateModal(true);
  };

  const openViewTemplateModal = (template) => {
    setSelectedTemplate(template);
    setShowViewTemplateModal(true);
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: "",
      description: "",
      category: "other",
      query: "",
      queryType: "sql",
      isPublic: false,
      tags: "",
      settings: {
        allowComments: true,
        allowForking: true,
        requireApproval: false
      }
    });
    setSelectedTemplate(null);
  };

  const getTemplateCategoryColor = (category) => {
    switch (category) {
      case "analytics": return "bg-blue-100 text-blue-800";
      case "finance": return "bg-green-100 text-green-800";
      case "marketing": return "bg-purple-100 text-purple-800";
      case "development": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Team management functions
  const handleCreateTeam = async () => {
    if (!teamForm.name) {
      setError("Team name is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const teamData = {
        ...teamForm,
        owner: "default-user" // In real app, get from auth
      };

      const response = await teamApi.createTeam(teamData);
      if (response.success) {
        setShowCreateTeamModal(false);
        resetTeamForm();
        loadTeams(); // Reload teams
      }
    } catch (err) {
      setError(err.message || "Failed to create team");
      console.error("Error creating team:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeam = async () => {
    if (!selectedTeam || !teamForm.name) {
      setError("Team name is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updateData = {
        name: teamForm.name,
        description: teamForm.description
      };

      const response = await teamApi.updateTeam(selectedTeam._id, updateData);
      if (response.success) {
        setShowEditTeamModal(false);
        resetTeamForm();
        loadTeams(); // Reload teams
      }
    } catch (err) {
      setError(err.message || "Failed to update team");
      console.error("Error updating team:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!confirm("Are you sure you want to delete this team?")) return;

    setLoading(true);
    setError(null);
    try {
      const response = await teamApi.deleteTeam(teamId);
      if (response.success) {
        loadTeams(); // Reload teams
      }
    } catch (err) {
      setError(err.message || "Failed to delete team");
      console.error("Error deleting team:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeamMember = async () => {
    if (!teamMemberForm.name || !teamMemberForm.email || !selectedTeam) {
      setError("Name and email are required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const memberData = {
        name: teamMemberForm.name,
        email: teamMemberForm.email,
        role: teamMemberForm.role,
        status: "offline"
      };

      const response = await teamApi.addMember(selectedTeam._id, memberData);
      if (response.success) {
        setShowAddTeamMemberModal(false);
        resetTeamMemberForm();
        loadTeams(); // Reload teams
      }
    } catch (err) {
      setError(err.message || "Failed to add team member");
      console.error("Error adding team member:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTeamMember = async (teamId, email) => {
    if (!confirm(`Are you sure you want to remove ${email} from this team?`)) return;

    setLoading(true);
    setError(null);
    try {
      const response = await teamApi.removeMember(teamId, email);
      if (response.success) {
        loadTeams(); // Reload teams
      }
    } catch (err) {
      setError(err.message || "Failed to remove team member");
      console.error("Error removing team member:", err);
    } finally {
      setLoading(false);
    }
  };

  const openEditTeamModal = (team) => {
    setSelectedTeam(team);
    setTeamForm({
      name: team.name,
      description: team.description,
      members: team.members
    });
    setShowEditTeamModal(true);
  };

  const openAddTeamMemberModal = (team) => {
    setSelectedTeam(team);
    setShowAddTeamMemberModal(true);
  };

  const resetTeamForm = () => {
    setTeamForm({
      name: "",
      description: "",
      members: []
    });
    setSelectedTeam(null);
  };

  const resetTeamMemberForm = () => {
    setTeamMemberForm({
      name: "",
      email: "",
      role: "Member"
    });
  };

  const getMemberStatusColor = (status) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-800";
      case "away": return "bg-yellow-100 text-yellow-800";
      case "offline": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Activity management functions
  const handleCreateActivity = async () => {
    if (!activityForm.title || !activityForm.description) {
      setError("Title and description are required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const activityData = {
        ...activityForm,
        user: "default-user" // In real app, get from auth
      };

      const response = await activityApi.createActivity(activityData);
      if (response.success) {
        setShowCreateActivityModal(false);
        resetActivityForm();
        loadActivities(); // Reload activities
        loadActivityStats(); // Reload stats
      }
    } catch (err) {
      setError(err.message || "Failed to create activity");
      console.error("Error creating activity:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;

    setLoading(true);
    setError(null);
    try {
      const response = await activityApi.deleteActivity(activityId);
      if (response.success) {
        loadActivities(); // Reload activities
        loadActivityStats(); // Reload stats
      }
    } catch (err) {
      setError(err.message || "Failed to delete activity");
      console.error("Error deleting activity:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (activityId) => {
    try {
      const response = await activityApi.markAsRead(activityId);
      if (response.success) {
        loadActivities(); // Reload activities
        loadActivityStats(); // Reload stats
      }
    } catch (err) {
      console.error("Error marking activity as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await activityApi.markAllAsRead('default-user');
      if (response.success) {
        loadActivities(); // Reload activities
        loadActivityStats(); // Reload stats
      }
    } catch (err) {
      console.error("Error marking all activities as read:", err);
    }
  };

  const openViewActivityModal = (activity) => {
    setSelectedActivity(activity);
    setShowViewActivityModal(true);
    // Mark as read when viewing
    if (!activity.isRead) {
      handleMarkAsRead(activity._id);
    }
  };

  const resetActivityForm = () => {
    setActivityForm({
      type: "user",
      title: "",
      description: "",
      priority: "medium",
      project: "",
      template: "",
      team: ""
    });
  };

  const getActivityTypeIcon = (type) => {
    switch (type) {
      case "query": return <FileText className="h-4 w-4" />;
      case "project": return <FolderOpen className="h-4 w-4" />;
      case "template": return <Copy className="h-4 w-4" />;
      case "team": return <Users className="h-4 w-4" />;
      case "system": return <Zap className="h-4 w-4" />;
      case "user": return <UserPlus className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getActivityTypeColor = (type) => {
    switch (type) {
      case "query": return "bg-blue-100 text-blue-800";
      case "project": return "bg-green-100 text-green-800";
      case "template": return "bg-purple-100 text-purple-800";
      case "team": return "bg-orange-100 text-orange-800";
      case "system": return "bg-red-100 text-red-800";
      case "user": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Workspace</h1>
            <p className="text-gray-600 dark:text-gray-400">Collaborative projects and team management</p>
          </div>
        </div>
        <Button 
          className="flex items-center gap-2" 
          onClick={() => setShowCreateModal(true)}
          disabled={loading}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-800">{error}</p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setError(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects, templates, or team members..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10"
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("all")}
                disabled={loading}
              >
                All
              </Button>
              <Button
                variant={filterType === "analytics" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("analytics")}
                disabled={loading}
              >
                Analytics
              </Button>
              <Button
                variant={filterType === "development" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange("development")}
                disabled={loading}
              >
                Development
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <Star 
                            className={`h-4 w-4 cursor-pointer ${project.isStarred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`}
                            onClick={(e) => handleToggleStar(project._id, e)}
                          />
                        </div>
                        <Badge className={getProjectTypeColor(project.type)}>
                          {project.type}
                        </Badge>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Team Members</span>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{project.members.length}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Queries</span>
                        <span className="font-medium">{project.queries}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Last Modified</span>
                        <span>{formatDate(project.lastModified)}</span>
                      </div>
                      
                      {/* Project Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditModal(project)}
                          disabled={loading}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openAddMemberModal(project)}
                          disabled={loading}
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Add Member
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleToggleArchive(project._id)}
                          disabled={loading}
                        >
                          <Archive className="h-3 w-3 mr-1" />
                          {project.status === 'archived' ? 'Activate' : 'Archive'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteProject(project._id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {projects.length === 0 && !loading && (
                <div className="col-span-full text-center py-12">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-500 mb-4">Create your first project to get started</p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold">Query Templates</h2>
                <p className="text-gray-600 dark:text-gray-400">Reusable query templates for common tasks</p>
              </div>
              <Button 
                onClick={() => setShowCreateTemplateModal(true)}
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>

            {/* Template Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={templateSearchTerm}
                  onChange={(e) => setTemplateSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={templateFilterCategory}
                  onChange={(e) => setTemplateFilterCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                  disabled={loading}
                >
                  <option value="all">All Categories</option>
                  <option value="analytics">Analytics</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                  <option value="development">Development</option>
                  <option value="other">Other</option>
                </select>
                <select
                  value={templateFilterType}
                  onChange={(e) => setTemplateFilterType(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                  disabled={loading}
                >
                  <option value="all">All Types</option>
                  <option value="sql">SQL</option>
                  <option value="mongodb">MongoDB</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => (
                <Card key={template._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant={template.isPublic ? "default" : "secondary"}>
                            {template.isPublic ? "Public" : "Private"}
                          </Badge>
                          <Badge className={getTemplateCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                          <Badge variant="outline">
                            {template.queryType.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                        <div className="flex items-center gap-4 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{template.usage} uses</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span>{template.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-gray-500">by {template.author}</span>
                          <span className="text-gray-500">{formatDate(template.createdAt)}</span>
                        </div>
                        {template.tags.length > 0 && (
                          <div className="flex gap-1 mb-3">
                            {template.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openViewTemplateModal(template)}
                          disabled={loading}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditTemplateModal(template)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleUseTemplate(template._id)}
                          disabled={loading}
                        >
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {templates.length === 0 && !loading && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                  <p className="text-gray-500 mb-4">Create your first template to get started</p>
                  <Button onClick={() => setShowCreateTemplateModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold">Team Management</h2>
                <p className="text-gray-600 dark:text-gray-400">Manage your teams and team members</p>
              </div>
              <Button 
                onClick={() => setShowCreateTeamModal(true)}
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </div>

            {/* Team Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search teams..."
                  value={teamSearchTerm}
                  onChange={(e) => setTeamSearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {teams.map((team) => (
                <Card key={team._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{team.name}</CardTitle>
                          <Badge variant="outline">
                            {team.members.length} members
                          </Badge>
                        </div>
                        <CardDescription>{team.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditTeamModal(team)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openAddTeamMemberModal(team)}
                          disabled={loading}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Member
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteTeam(team._id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h4 className="font-medium">Team Members</h4>
                      {team.members.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {team.members.map((member, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-semibold text-primary text-sm">
                                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-medium text-sm">{member.name}</h5>
                                  <Badge className={getMemberStatusColor(member.status)}>
                                    {member.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-500 mb-1">{member.role}</p>
                                <p className="text-xs text-gray-400">{member.email}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  disabled={loading}
                                >
                                  <MessageSquare className="h-3 w-3" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                  onClick={() => handleRemoveTeamMember(team._id, member.email)}
                                  disabled={loading}
                                >
                                  <UserMinus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>No members yet</p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openAddTeamMemberModal(team)}
                            className="mt-2"
                            disabled={loading}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add First Member
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {teams.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
                  <p className="text-gray-500 mb-4">Create your first team to get started</p>
                  <Button onClick={() => setShowCreateTeamModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Team
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold">Activity Feed</h2>
                <p className="text-gray-600 dark:text-gray-400">Track your recent activities and notifications</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  variant="outline"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
                <Button 
                  onClick={() => setShowCreateActivityModal(true)}
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </div>
            </div>

            {/* Activity Stats */}
            {activityStats.total !== undefined && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Activities</p>
                        <p className="text-2xl font-semibold">{activityStats.total || 0}</p>
                      </div>
                      <Bell className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Unread</p>
                        <p className="text-2xl font-semibold text-orange-600">{activityStats.unread || 0}</p>
                      </div>
                      <EyeOff className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">High Priority</p>
                        <p className="text-2xl font-semibold text-red-600">
                          {activityStats.byPriority?.find(p => p._id === 'high')?.count || 0}
                        </p>
                      </div>
                      <Zap className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Today</p>
                        <p className="text-2xl font-semibold text-green-600">
                          {activities.filter(a => {
                            const today = new Date();
                            const activityDate = new Date(a.timestamp);
                            return activityDate.toDateString() === today.toDateString();
                          }).length}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Activity Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search activities..."
                  value={activitySearchTerm}
                  onChange={(e) => setActivitySearchTerm(e.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              <select
                value={activityFilterType}
                onChange={(e) => setActivityFilterType(e.target.value)}
                className="px-3 py-2 border rounded-md"
                disabled={loading}
              >
                <option value="all">All Types</option>
                <option value="query">Query</option>
                <option value="project">Project</option>
                <option value="template">Template</option>
                <option value="team">Team</option>
                <option value="system">System</option>
                <option value="user">User</option>
              </select>
              <select
                value={activityFilterPriority}
                onChange={(e) => setActivityFilterPriority(e.target.value)}
                className="px-3 py-2 border rounded-md"
                disabled={loading}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <Card key={activity._id} className={`hover:shadow-lg transition-shadow ${!activity.isRead ? 'border-l-4 border-l-orange-500' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityTypeColor(activity.type)}`}>
                        {getActivityTypeIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{activity.title}</h3>
                          <Badge className={getActivityTypeColor(activity.type)}>
                            {activity.type}
                          </Badge>
                          <Badge className={getPriorityColor(activity.priority)}>
                            {activity.priority}
                          </Badge>
                          {!activity.isRead && (
                            <Badge className="bg-orange-100 text-orange-800">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {activity.description}
                        </p>
                        {activity.project && (
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-500">Project</span>
                            <span>{activity.project}</span>
                          </div>
                        )}
                        {activity.team && (
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-500">Team</span>
                            <span>{activity.team}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Time</span>
                          <span>{formatTimestamp(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => openViewActivityModal(activity)}
                        disabled={loading}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {!activity.isRead && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkAsRead(activity._id)}
                          disabled={loading}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Mark Read
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteActivity(activity._id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {activities.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                  <p className="text-gray-500 mb-4">Your activity feed will appear here</p>
                  <Button onClick={() => setShowCreateActivityModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Activity
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <Input
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  placeholder="Enter project description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={projectForm.type}
                  onChange={(e) => setProjectForm({...projectForm, type: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="analytics">Analytics</option>
                  <option value="development">Development</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <Input
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({...projectForm, tags: e.target.value})}
                  placeholder="Enter tags"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={handleCreateProject}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Creating..." : "Create Project"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCreateModal(false);
                  resetProjectForm();
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <Input
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  placeholder="Enter project description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={projectForm.type}
                  onChange={(e) => setProjectForm({...projectForm, type: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="analytics">Analytics</option>
                  <option value="development">Development</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <Input
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({...projectForm, tags: e.target.value})}
                  placeholder="Enter tags"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={handleUpdateProject}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Updating..." : "Update Project"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowEditModal(false);
                  resetProjectForm();
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Member to {selectedProject.name}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <Input
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Enter member email"
                  type="email"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button 
                onClick={handleAddMember}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Adding..." : "Add Member"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddMemberModal(false);
                  setNewMemberEmail("");
                }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
                     </div>
         </div>
       )}

       {/* Create Template Modal */}
       {showCreateTemplateModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
             <h2 className="text-xl font-semibold mb-4">Create New Template</h2>
             <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium mb-1">Template Name</label>
                   <Input
                     value={templateForm.name}
                     onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                     placeholder="Enter template name"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-1">Category</label>
                   <select
                     value={templateForm.category}
                     onChange={(e) => setTemplateForm({...templateForm, category: e.target.value})}
                     className="w-full p-2 border rounded-md"
                   >
                     <option value="analytics">Analytics</option>
                     <option value="finance">Finance</option>
                     <option value="marketing">Marketing</option>
                     <option value="development">Development</option>
                     <option value="other">Other</option>
                   </select>
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Description</label>
                 <Input
                   value={templateForm.description}
                   onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})}
                   placeholder="Enter template description"
                 />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium mb-1">Query Type</label>
                   <select
                     value={templateForm.queryType}
                     onChange={(e) => setTemplateForm({...templateForm, queryType: e.target.value})}
                     className="w-full p-2 border rounded-md"
                   >
                     <option value="sql">SQL</option>
                     <option value="mongodb">MongoDB</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                   <Input
                     value={templateForm.tags}
                     onChange={(e) => setTemplateForm({...templateForm, tags: e.target.value})}
                     placeholder="Enter tags"
                   />
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Query</label>
                 <Textarea
                   value={templateForm.query}
                   onChange={(e) => setTemplateForm({...templateForm, query: e.target.value})}
                   placeholder="Enter your query here..."
                   rows={6}
                   className="font-mono text-sm"
                 />
               </div>
               <div className="flex items-center gap-4">
                 <label className="flex items-center gap-2">
                   <input
                     type="checkbox"
                     checked={templateForm.isPublic}
                     onChange={(e) => setTemplateForm({...templateForm, isPublic: e.target.checked})}
                     className="rounded"
                   />
                   <span className="text-sm">Make public</span>
                 </label>
               </div>
             </div>
             <div className="flex gap-2 mt-6">
               <Button 
                 onClick={handleCreateTemplate}
                 disabled={loading}
                 className="flex-1"
               >
                 {loading ? "Creating..." : "Create Template"}
               </Button>
               <Button 
                 variant="outline" 
                 onClick={() => {
                   setShowCreateTemplateModal(false);
                   resetTemplateForm();
                 }}
                 disabled={loading}
               >
                 Cancel
               </Button>
             </div>
           </div>
         </div>
       )}

       {/* Edit Template Modal */}
       {showEditTemplateModal && selectedTemplate && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
             <h2 className="text-xl font-semibold mb-4">Edit Template</h2>
             <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium mb-1">Template Name</label>
                   <Input
                     value={templateForm.name}
                     onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                     placeholder="Enter template name"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-1">Category</label>
                   <select
                     value={templateForm.category}
                     onChange={(e) => setTemplateForm({...templateForm, category: e.target.value})}
                     className="w-full p-2 border rounded-md"
                   >
                     <option value="analytics">Analytics</option>
                     <option value="finance">Finance</option>
                     <option value="marketing">Marketing</option>
                     <option value="development">Development</option>
                     <option value="other">Other</option>
                   </select>
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Description</label>
                 <Input
                   value={templateForm.description}
                   onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})}
                   placeholder="Enter template description"
                 />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium mb-1">Query Type</label>
                   <select
                     value={templateForm.queryType}
                     onChange={(e) => setTemplateForm({...templateForm, queryType: e.target.value})}
                     className="w-full p-2 border rounded-md"
                   >
                     <option value="sql">SQL</option>
                     <option value="mongodb">MongoDB</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                   <Input
                     value={templateForm.tags}
                     onChange={(e) => setTemplateForm({...templateForm, tags: e.target.value})}
                     placeholder="Enter tags"
                   />
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Query</label>
                 <Textarea
                   value={templateForm.query}
                   onChange={(e) => setTemplateForm({...templateForm, query: e.target.value})}
                   placeholder="Enter your query here..."
                   rows={6}
                   className="font-mono text-sm"
                 />
               </div>
               <div className="flex items-center gap-4">
                 <label className="flex items-center gap-2">
                   <input
                     type="checkbox"
                     checked={templateForm.isPublic}
                     onChange={(e) => setTemplateForm({...templateForm, isPublic: e.target.checked})}
                     className="rounded"
                   />
                   <span className="text-sm">Make public</span>
                 </label>
               </div>
             </div>
             <div className="flex gap-2 mt-6">
               <Button 
                 onClick={handleUpdateTemplate}
                 disabled={loading}
                 className="flex-1"
               >
                 {loading ? "Updating..." : "Update Template"}
               </Button>
               <Button 
                 variant="outline" 
                 onClick={() => {
                   setShowEditTemplateModal(false);
                   resetTemplateForm();
                 }}
                 disabled={loading}
               >
                 Cancel
               </Button>
             </div>
           </div>
         </div>
       )}

       {/* View Template Modal */}
       {showViewTemplateModal && selectedTemplate && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-semibold">{selectedTemplate.name}</h2>
               <Button 
                 variant="ghost" 
                 size="sm"
                 onClick={() => setShowViewTemplateModal(false)}
               >
                 <X className="h-4 w-4" />
               </Button>
             </div>
             <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <Badge variant={selectedTemplate.isPublic ? "default" : "secondary"}>
                   {selectedTemplate.isPublic ? "Public" : "Private"}
                 </Badge>
                 <Badge className={getTemplateCategoryColor(selectedTemplate.category)}>
                   {selectedTemplate.category}
                 </Badge>
                 <Badge variant="outline">
                   {selectedTemplate.queryType.toUpperCase()}
                 </Badge>
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Description</label>
                 <p className="text-gray-600 dark:text-gray-400">{selectedTemplate.description}</p>
               </div>
               <div className="grid grid-cols-2 gap-4 text-sm">
                 <div>
                   <span className="text-gray-500">Usage:</span>
                   <span className="ml-2 font-medium">{selectedTemplate.usage} times</span>
                 </div>
                 <div>
                   <span className="text-gray-500">Rating:</span>
                   <span className="ml-2 font-medium">{selectedTemplate.rating.toFixed(1)}/5</span>
                 </div>
                 <div>
                   <span className="text-gray-500">Author:</span>
                   <span className="ml-2 font-medium">{selectedTemplate.author}</span>
                 </div>
                 <div>
                   <span className="text-gray-500">Created:</span>
                   <span className="ml-2 font-medium">{formatDate(selectedTemplate.createdAt)}</span>
                 </div>
               </div>
               {selectedTemplate.tags.length > 0 && (
                 <div>
                   <label className="block text-sm font-medium mb-1">Tags</label>
                   <div className="flex gap-1">
                     {selectedTemplate.tags.map((tag, index) => (
                       <Badge key={index} variant="outline" className="text-xs">
                         {tag}
                       </Badge>
                     ))}
                   </div>
                 </div>
               )}
               <div>
                 <label className="block text-sm font-medium mb-1">Query</label>
                 <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                   <pre className="text-sm font-mono whitespace-pre-wrap">{selectedTemplate.query}</pre>
                 </div>
               </div>
             </div>
             <div className="flex gap-2 mt-6">
               <Button 
                 onClick={() => handleUseTemplate(selectedTemplate._id)}
                 disabled={loading}
                 className="flex-1"
               >
                 <Copy className="h-4 w-4 mr-2" />
                 Use Template
               </Button>
               <Button 
                 variant="outline"
                 onClick={() => handleForkTemplate(selectedTemplate._id)}
                 disabled={loading}
               >
                 <GitFork className="h-4 w-4 mr-2" />
                 Fork Template
               </Button>
               <Button 
                 variant="outline"
                 onClick={() => {
                   openEditTemplateModal(selectedTemplate);
                   setShowViewTemplateModal(false);
                 }}
                 disabled={loading}
               >
                 <Edit className="h-4 w-4 mr-2" />
                 Edit
               </Button>
               <Button 
                 variant="outline"
                 onClick={() => handleDeleteTemplate(selectedTemplate._id)}
                 disabled={loading}
                 className="text-red-600 hover:text-red-700"
               >
                 <Trash2 className="h-4 w-4" />
               </Button>
             </div>
           </div>
         </div>
       )}

       {/* Create Team Modal */}
       {showCreateTeamModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
             <h2 className="text-xl font-semibold mb-4">Create New Team</h2>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium mb-1">Team Name</label>
                 <Input
                   value={teamForm.name}
                   onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                   placeholder="Enter team name"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Description</label>
                 <Textarea
                   value={teamForm.description}
                   onChange={(e) => setTeamForm({...teamForm, description: e.target.value})}
                   placeholder="Enter team description"
                   rows={3}
                 />
               </div>
             </div>
             <div className="flex gap-2 mt-6">
               <Button 
                 onClick={handleCreateTeam}
                 disabled={loading}
                 className="flex-1"
               >
                 {loading ? "Creating..." : "Create Team"}
               </Button>
               <Button 
                 variant="outline" 
                 onClick={() => {
                   setShowCreateTeamModal(false);
                   resetTeamForm();
                 }}
                 disabled={loading}
               >
                 Cancel
               </Button>
             </div>
           </div>
         </div>
       )}

       {/* Edit Team Modal */}
       {showEditTeamModal && selectedTeam && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
             <h2 className="text-xl font-semibold mb-4">Edit Team</h2>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium mb-1">Team Name</label>
                 <Input
                   value={teamForm.name}
                   onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                   placeholder="Enter team name"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Description</label>
                 <Textarea
                   value={teamForm.description}
                   onChange={(e) => setTeamForm({...teamForm, description: e.target.value})}
                   placeholder="Enter team description"
                   rows={3}
                 />
               </div>
             </div>
             <div className="flex gap-2 mt-6">
               <Button 
                 onClick={handleUpdateTeam}
                 disabled={loading}
                 className="flex-1"
               >
                 {loading ? "Updating..." : "Update Team"}
               </Button>
               <Button 
                 variant="outline" 
                 onClick={() => {
                   setShowEditTeamModal(false);
                   resetTeamForm();
                 }}
                 disabled={loading}
               >
                 Cancel
               </Button>
             </div>
           </div>
         </div>
       )}

       {/* Add Team Member Modal */}
       {showAddTeamMemberModal && selectedTeam && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
             <h2 className="text-xl font-semibold mb-4">Add Member to {selectedTeam.name}</h2>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium mb-1">Name</label>
                 <Input
                   value={teamMemberForm.name}
                   onChange={(e) => setTeamMemberForm({...teamMemberForm, name: e.target.value})}
                   placeholder="Enter member name"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Email</label>
                 <Input
                   value={teamMemberForm.email}
                   onChange={(e) => setTeamMemberForm({...teamMemberForm, email: e.target.value})}
                   placeholder="Enter member email"
                   type="email"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Role</label>
                 <select
                   value={teamMemberForm.role}
                   onChange={(e) => setTeamMemberForm({...teamMemberForm, role: e.target.value})}
                   className="w-full p-2 border rounded-md"
                 >
                   <option value="Member">Member</option>
                   <option value="Lead">Lead</option>
                   <option value="Manager">Manager</option>
                   <option value="Admin">Admin</option>
                 </select>
               </div>
             </div>
             <div className="flex gap-2 mt-6">
               <Button 
                 onClick={handleAddTeamMember}
                 disabled={loading}
                 className="flex-1"
               >
                 {loading ? "Adding..." : "Add Member"}
               </Button>
               <Button 
                 variant="outline" 
                 onClick={() => {
                   setShowAddTeamMemberModal(false);
                   resetTeamMemberForm();
                 }}
                 disabled={loading}
               >
                 Cancel
               </Button>
             </div>
           </div>
         </div>
       )}

       {/* Create Activity Modal */}
       {showCreateActivityModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
             <h2 className="text-xl font-semibold mb-4">Create New Activity</h2>
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium mb-1">Activity Type</label>
                 <select
                   value={activityForm.type}
                   onChange={(e) => setActivityForm({...activityForm, type: e.target.value})}
                   className="w-full p-2 border rounded-md"
                 >
                   <option value="query">Query</option>
                   <option value="project">Project</option>
                   <option value="template">Template</option>
                   <option value="team">Team</option>
                   <option value="system">System</option>
                   <option value="user">User</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Title</label>
                 <Input
                   value={activityForm.title}
                   onChange={(e) => setActivityForm({...activityForm, title: e.target.value})}
                   placeholder="Enter activity title"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Description</label>
                 <Textarea
                   value={activityForm.description}
                   onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
                   placeholder="Enter activity description"
                   rows={3}
                 />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium mb-1">Priority</label>
                   <select
                     value={activityForm.priority}
                     onChange={(e) => setActivityForm({...activityForm, priority: e.target.value})}
                     className="w-full p-2 border rounded-md"
                   >
                     <option value="low">Low</option>
                     <option value="medium">Medium</option>
                     <option value="high">High</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-1">Project (Optional)</label>
                   <Input
                     value={activityForm.project}
                     onChange={(e) => setActivityForm({...activityForm, project: e.target.value})}
                     placeholder="Enter project name"
                   />
                 </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium mb-1">Template (Optional)</label>
                   <Input
                     value={activityForm.template}
                     onChange={(e) => setActivityForm({...activityForm, template: e.target.value})}
                     placeholder="Enter template name"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-1">Team (Optional)</label>
                   <Input
                     value={activityForm.team}
                     onChange={(e) => setActivityForm({...activityForm, team: e.target.value})}
                     placeholder="Enter team name"
                   />
                 </div>
               </div>
             </div>
             <div className="flex gap-2 mt-6">
               <Button 
                 onClick={handleCreateActivity}
                 disabled={loading}
                 className="flex-1"
               >
                 {loading ? "Creating..." : "Create Activity"}
               </Button>
               <Button 
                 variant="outline" 
                 onClick={() => {
                   setShowCreateActivityModal(false);
                   resetActivityForm();
                 }}
                 disabled={loading}
               >
                 Cancel
               </Button>
             </div>
           </div>
         </div>
       )}

       {/* View Activity Modal */}
       {showViewActivityModal && selectedActivity && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-xl font-semibold">Activity Details</h2>
               <Button 
                 variant="ghost" 
                 size="sm"
                 onClick={() => setShowViewActivityModal(false)}
               >
                 <X className="h-4 w-4" />
               </Button>
             </div>
             <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <Badge className={getActivityTypeColor(selectedActivity.type)}>
                   {selectedActivity.type}
                 </Badge>
                 <Badge className={getPriorityColor(selectedActivity.priority)}>
                   {selectedActivity.priority}
                 </Badge>
                 {!selectedActivity.isRead && (
                   <Badge className="bg-orange-100 text-orange-800">
                     New
                   </Badge>
                 )}
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Title</label>
                 <p className="text-gray-900 dark:text-gray-100 font-medium">{selectedActivity.title}</p>
               </div>
               <div>
                 <label className="block text-sm font-medium mb-1">Description</label>
                 <p className="text-gray-600 dark:text-gray-400">{selectedActivity.description}</p>
               </div>
               <div className="grid grid-cols-2 gap-4 text-sm">
                 {selectedActivity.project && (
                   <div>
                     <span className="text-gray-500">Project:</span>
                     <span className="ml-2 font-medium">{selectedActivity.project}</span>
                   </div>
                 )}
                 {selectedActivity.team && (
                   <div>
                     <span className="text-gray-500">Team:</span>
                     <span className="ml-2 font-medium">{selectedActivity.team}</span>
                   </div>
                 )}
                 {selectedActivity.template && (
                   <div>
                     <span className="text-gray-500">Template:</span>
                     <span className="ml-2 font-medium">{selectedActivity.template}</span>
                   </div>
                 )}
                 <div>
                   <span className="text-gray-500">Created:</span>
                   <span className="ml-2 font-medium">{formatTimestamp(selectedActivity.timestamp)}</span>
                 </div>
               </div>
             </div>
             <div className="flex gap-2 mt-6">
               {!selectedActivity.isRead && (
                 <Button 
                   onClick={() => {
                     handleMarkAsRead(selectedActivity._id);
                     setShowViewActivityModal(false);
                   }}
                   disabled={loading}
                   className="flex-1"
                 >
                   <Eye className="h-4 w-4 mr-2" />
                   Mark as Read
                 </Button>
               )}
               <Button 
                 variant="outline"
                 onClick={() => handleDeleteActivity(selectedActivity._id)}
                 disabled={loading}
                 className="text-red-600 hover:text-red-700"
               >
                 <Trash2 className="h-4 w-4 mr-2" />
                 Delete Activity
               </Button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 } 