import { Request, Response } from 'express';
import Project, { IProject } from '../models/Project';

class ProjectController {
  // Create a new project
  async createProject(req: Request, res: Response) {
    try {
      const { name, description, type, members, tags, settings } = req.body;
      
      // Validate required fields
      if (!name || !description) {
        return res.status(400).json({
          success: false,
          message: 'Name and description are required'
        });
      }

      // Create new project
      const project = new Project({
        name,
        description,
        type: type || 'other',
        members: members || [],
        owner: req.body.owner || 'default-user', // In real app, get from auth
        tags: tags || [],
        settings: {
          isPublic: settings?.isPublic || false,
          allowComments: settings?.allowComments !== false,
          autoBackup: settings?.autoBackup !== false
        }
      });

      const savedProject = await project.save();

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: savedProject
      });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create project',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get all projects (with filtering and pagination)
  async getProjects(req: Request, res: Response) {
    try {
      const { 
        owner, 
        type, 
        status, 
        isStarred, 
        page = 1, 
        limit = 10,
        search 
      } = req.query;

      const filter: any = {};

      // Apply filters
      if (owner) filter.owner = owner;
      if (type) filter.type = type;
      if (status) filter.status = status;
      if (isStarred !== undefined) filter.isStarred = isStarred === 'true';

      // Search functionality
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search as string, 'i')] } }
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);

      const projects = await Project.find(filter)
        .sort({ lastModified: -1 })
        .skip(skip)
        .limit(Number(limit));

      const total = await Project.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: projects,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch projects',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get a single project by ID
  async getProject(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const project = await Project.findById(id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.status(200).json({
        success: true,
        data: project
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch project',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update a project
  async updateProject(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove fields that shouldn't be updated directly
      delete updateData._id;
      delete updateData.createdAt;
      delete updateData.owner;

      const project = await Project.findByIdAndUpdate(
        id,
        { ...updateData, lastModified: new Date() },
        { new: true, runValidators: true }
      );

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update project',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete a project
  async deleteProject(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const project = await Project.findByIdAndDelete(id);

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete project',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Toggle star status
  async toggleStar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const project = await Project.findById(id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      project.isStarred = !project.isStarred;
      project.lastModified = new Date();
      
      const updatedProject = await project.save();

      res.status(200).json({
        success: true,
        message: `Project ${updatedProject.isStarred ? 'starred' : 'unstarred'} successfully`,
        data: updatedProject
      });
    } catch (error) {
      console.error('Error toggling star:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle star status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Archive/Unarchive project
  async toggleArchive(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const project = await Project.findById(id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      project.status = project.status === 'archived' ? 'active' : 'archived';
      project.lastModified = new Date();
      
      const updatedProject = await project.save();

      res.status(200).json({
        success: true,
        message: `Project ${updatedProject.status === 'archived' ? 'archived' : 'activated'} successfully`,
        data: updatedProject
      });
    } catch (error) {
      console.error('Error toggling archive:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to toggle archive status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Add member to project
  async addMember(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const project = await Project.findById(id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      if (project.members.includes(email)) {
        return res.status(400).json({
          success: false,
          message: 'Member already exists in project'
        });
      }

      project.members.push(email);
      project.lastModified = new Date();
      
      const updatedProject = await project.save();

      res.status(200).json({
        success: true,
        message: 'Member added successfully',
        data: updatedProject
      });
    } catch (error) {
      console.error('Error adding member:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add member',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Remove member from project
  async removeMember(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      const project = await Project.findById(id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }

      project.members = project.members.filter(member => member !== email);
      project.lastModified = new Date();
      
      const updatedProject = await project.save();

      res.status(200).json({
        success: true,
        message: 'Member removed successfully',
        data: updatedProject
      });
    } catch (error) {
      console.error('Error removing member:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove member',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get project statistics
  async getProjectStats(req: Request, res: Response) {
    try {
      const { owner } = req.query;

      const filter: any = {};
      if (owner) filter.owner = owner;

      const stats = await Project.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalProjects: { $sum: 1 },
            activeProjects: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            archivedProjects: { $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] } },
            starredProjects: { $sum: { $cond: ['$isStarred', 1, 0] } },
            totalQueries: { $sum: '$queries' },
            avgQueries: { $avg: '$queries' }
          }
        }
      ]);

      const typeStats = await Project.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: {
          overview: stats[0] || {
            totalProjects: 0,
            activeProjects: 0,
            archivedProjects: 0,
            starredProjects: 0,
            totalQueries: 0,
            avgQueries: 0
          },
          byType: typeStats
        }
      });
    } catch (error) {
      console.error('Error fetching project stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch project statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new ProjectController(); 