import { Request, Response } from 'express';
import Activity, { IActivity } from '../models/Activity';

class ActivityController {
  // Create a new activity
  async createActivity(req: Request, res: Response) {
    try {
      const { type, title, description, project, template, team, metadata, priority } = req.body;
      if (!type || !title || !description) {
        return res.status(400).json({ success: false, message: 'Type, title, and description are required' });
      }
      const activity = new Activity({
        type,
        title,
        description,
        user: req.body.user || 'default-user',
        project,
        template,
        team,
        metadata,
        priority: priority || 'medium'
      });
      const savedActivity = await activity.save();
      res.status(201).json({ success: true, message: 'Activity created', data: savedActivity });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create activity', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Get all activities (optionally filter by user, type, project)
  async getActivities(req: Request, res: Response) {
    try {
      const { user, type, project, limit = 50, page = 1 } = req.query;
      const filter: any = {};
      if (user) filter.user = user;
      if (type) filter.type = type;
      if (project) filter.project = project;

      const skip = (Number(page) - 1) * Number(limit);
      const activities = await Activity.find(filter)
        .sort({ timestamp: -1 })
        .limit(Number(limit))
        .skip(skip);
      
      const total = await Activity.countDocuments(filter);
      
      res.status(200).json({ 
        success: true, 
        data: activities,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch activities', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Get a single activity by ID
  async getActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const activity = await Activity.findById(id);
      if (!activity) {
        return res.status(404).json({ success: false, message: 'Activity not found' });
      }
      res.status(200).json({ success: true, data: activity });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch activity', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Update an activity
  async updateActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      delete updateData._id;
      delete updateData.user;
      delete updateData.timestamp;
      
      const activity = await Activity.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!activity) {
        return res.status(404).json({ success: false, message: 'Activity not found' });
      }
      res.status(200).json({ success: true, message: 'Activity updated', data: activity });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update activity', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Delete an activity
  async deleteActivity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const activity = await Activity.findByIdAndDelete(id);
      if (!activity) {
        return res.status(404).json({ success: false, message: 'Activity not found' });
      }
      res.status(200).json({ success: true, message: 'Activity deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete activity', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Mark activity as read
  async markAsRead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const activity = await Activity.findByIdAndUpdate(id, { isRead: true }, { new: true });
      if (!activity) {
        return res.status(404).json({ success: false, message: 'Activity not found' });
      }
      res.status(200).json({ success: true, message: 'Activity marked as read', data: activity });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to mark activity as read', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Mark all activities as read for a user
  async markAllAsRead(req: Request, res: Response) {
    try {
      const { user } = req.params;
      const result = await Activity.updateMany({ user, isRead: false }, { isRead: true });
      res.status(200).json({ success: true, message: 'All activities marked as read', count: result.modifiedCount });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to mark activities as read', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Get activity statistics
  async getActivityStats(req: Request, res: Response) {
    try {
      const { user } = req.query;
      const filter: any = {};
      if (user) filter.user = user;

      const stats = await Activity.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            unread: { $sum: { $cond: ['$isRead', 0, 1] } },
            byType: {
              $push: {
                type: '$type',
                priority: '$priority'
              }
            }
          }
        }
      ]);

      const typeStats = await Activity.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]);

      const priorityStats = await Activity.aggregate([
        { $match: filter },
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: {
          total: stats[0]?.total || 0,
          unread: stats[0]?.unread || 0,
          byType: typeStats,
          byPriority: priorityStats
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch activity stats', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}

export default new ActivityController(); 