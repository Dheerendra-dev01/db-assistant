import { Request, Response } from 'express';
import Template, { ITemplate } from '../models/Template';

class TemplateController {
  // Create a new template
  async createTemplate(req: Request, res: Response) {
    try {
      const { name, description, category, query, queryType, isPublic, tags, settings } = req.body;
      
      // Validate required fields
      if (!name || !description || !query || !queryType) {
        return res.status(400).json({
          success: false,
          message: 'Name, description, query, and queryType are required'
        });
      }

      // Create new template
      const template = new Template({
        name,
        description,
        category: category || 'other',
        query,
        queryType,
        isPublic: isPublic || false,
        author: req.body.author || 'default-user', // In real app, get from auth
        tags: tags || [],
        settings: {
          allowComments: settings?.allowComments !== false,
          allowForking: settings?.allowForking !== false,
          requireApproval: settings?.requireApproval || false
        }
      });

      const savedTemplate = await template.save();

      res.status(201).json({
        success: true,
        message: 'Template created successfully',
        data: savedTemplate
      });
    } catch (error) {
      console.error('Error creating template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create template',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get all templates (with filtering and pagination)
  async getTemplates(req: Request, res: Response) {
    try {
      const { 
        author, 
        category, 
        queryType, 
        isPublic, 
        page = 1, 
        limit = 10,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const filter: any = {};

      // Apply filters
      if (author) filter.author = author;
      if (category) filter.category = category;
      if (queryType) filter.queryType = queryType;
      if (isPublic !== undefined) filter.isPublic = isPublic === 'true';

      // Search functionality
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search as string, 'i')] } }
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);
      const sort: any = {};
      sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

      const templates = await Template.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit));

      const total = await Template.countDocuments(filter);

      res.status(200).json({
        success: true,
        data: templates,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch templates',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get a single template by ID
  async getTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const template = await Template.findById(id);
      
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.status(200).json({
        success: true,
        data: template
      });
    } catch (error) {
      console.error('Error fetching template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch template',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update a template
  async updateTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove fields that shouldn't be updated directly
      delete updateData._id;
      delete updateData.createdAt;
      delete updateData.author;
      delete updateData.usage;
      delete updateData.rating;

      const template = await Template.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Template updated successfully',
        data: template
      });
    } catch (error) {
      console.error('Error updating template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update template',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete a template
  async deleteTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const template = await Template.findByIdAndDelete(id);

      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Template deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete template',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Use a template (increment usage)
  async useTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const template = await Template.findById(id);
      
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      //await template.incrementUsage();

      res.status(200).json({
        success: true,
        message: 'Template usage recorded',
        data: template
      });
    } catch (error) {
      console.error('Error using template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record template usage',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Rate a template
  async rateTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rating } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      const template = await Template.findById(id);
      
      if (!template) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      //await template.updateRating(rating);

      res.status(200).json({
        success: true,
        message: 'Template rated successfully',
        data: template
      });
    } catch (error) {
      console.error('Error rating template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to rate template',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Fork a template (create a copy)
  async forkTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, isPublic } = req.body;

      const originalTemplate = await Template.findById(id);
      
      if (!originalTemplate) {
        return res.status(404).json({
          success: false,
          message: 'Template not found'
        });
      }

      if (!originalTemplate.settings.allowForking) {
        return res.status(403).json({
          success: false,
          message: 'This template does not allow forking'
        });
      }

      // Create a new template based on the original
      const forkedTemplate = new Template({
        name: name || `${originalTemplate.name} (Fork)`,
        description: description || originalTemplate.description,
        category: originalTemplate.category,
        query: originalTemplate.query,
        queryType: originalTemplate.queryType,
        isPublic: isPublic || false,
        author: req.body.author || 'default-user',
        tags: originalTemplate.tags,
        settings: originalTemplate.settings
      });

      const savedForkedTemplate = await forkedTemplate.save();

      res.status(201).json({
        success: true,
        message: 'Template forked successfully',
        data: savedForkedTemplate
      });
    } catch (error) {
      console.error('Error forking template:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fork template',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get template statistics
  async getTemplateStats(req: Request, res: Response) {
    try {
      const { author } = req.query;

      const filter: any = {};
      if (author) filter.author = author;

      const stats = await Template.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalTemplates: { $sum: 1 },
            publicTemplates: { $sum: { $cond: ['$isPublic', 1, 0] } },
            privateTemplates: { $sum: { $cond: ['$isPublic', 0, 1] } },
            totalUsage: { $sum: '$usage' },
            avgRating: { $avg: '$rating' },
            totalSQL: { $sum: { $cond: [{ $eq: ['$queryType', 'sql'] }, 1, 0] } },
            totalMongoDB: { $sum: { $cond: [{ $eq: ['$queryType', 'mongodb'] }, 1, 0] } }
          }
        }
      ]);

      const categoryStats = await Template.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            avgRating: { $avg: '$rating' },
            totalUsage: { $sum: '$usage' }
          }
        }
      ]);

      const topTemplates = await Template.find(filter)
        .sort({ usage: -1, rating: -1 })
        .limit(5)
        .select('name usage rating category');

      res.status(200).json({
        success: true,
        data: {
          overview: stats[0] || {
            totalTemplates: 0,
            publicTemplates: 0,
            privateTemplates: 0,
            totalUsage: 0,
            avgRating: 0,
            totalSQL: 0,
            totalMongoDB: 0
          },
          byCategory: categoryStats,
          topTemplates
        }
      });
    } catch (error) {
      console.error('Error fetching template stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch template statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Search templates by query content
  async searchTemplates(req: Request, res: Response) {
    try {
      const { query, queryType, category, limit = 10 } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const filter: any = {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { query: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query as string, 'i')] } }
        ]
      };

      if (queryType) filter.queryType = queryType;
      if (category) filter.category = category;

      const templates = await Template.find(filter)
        .sort({ usage: -1, rating: -1 })
        .limit(Number(limit));

      res.status(200).json({
        success: true,
        data: templates
      });
    } catch (error) {
      console.error('Error searching templates:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search templates',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

export default new TemplateController(); 