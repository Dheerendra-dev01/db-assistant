import { Request, Response } from 'express';
import Team, { ITeam, ITeamMember } from '../models/Team';

class TeamController {
  // Create a new team
  async createTeam(req: Request, res: Response) {
    try {
      const { name, description, members } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Team name is required' });
      }
      const team = new Team({
        name,
        description,
        owner: req.body.owner || 'default-user',
        members: members || []
      });
      const savedTeam = await team.save();
      res.status(201).json({ success: true, message: 'Team created', data: savedTeam });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create team', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Get all teams (optionally filter by owner)
  async getTeams(req: Request, res: Response) {
    try {
      const { owner } = req.query;
      const filter: any = {};
      if (owner) filter.owner = owner;
      const teams = await Team.find(filter).sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: teams });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch teams', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Get a single team by ID
  async getTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const team = await Team.findById(id);
      if (!team) {
        return res.status(404).json({ success: false, message: 'Team not found' });
      }
      res.status(200).json({ success: true, data: team });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch team', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Update a team
  async updateTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      delete updateData._id;
      delete updateData.owner;
      const team = await Team.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!team) {
        return res.status(404).json({ success: false, message: 'Team not found' });
      }
      res.status(200).json({ success: true, message: 'Team updated', data: team });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update team', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Delete a team
  async deleteTeam(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const team = await Team.findByIdAndDelete(id);
      if (!team) {
        return res.status(404).json({ success: false, message: 'Team not found' });
      }
      res.status(200).json({ success: true, message: 'Team deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete team', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Add member to team
  async addMember(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const member: ITeamMember = req.body;
      if (!member.email || !member.name || !member.role) {
        return res.status(400).json({ success: false, message: 'Name, email, and role are required' });
      }
      const team = await Team.findById(id);
      if (!team) {
        return res.status(404).json({ success: false, message: 'Team not found' });
      }
      if (team.members.some(m => m.email === member.email)) {
        return res.status(400).json({ success: false, message: 'Member already exists' });
      }
      team.members.push(member);
      await team.save();
      res.status(200).json({ success: true, message: 'Member added', data: team });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to add member', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // Remove member from team
  async removeMember(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }
      const team = await Team.findById(id);
      if (!team) {
        return res.status(404).json({ success: false, message: 'Team not found' });
      }
      team.members = team.members.filter(m => m.email !== email);
      await team.save();
      res.status(200).json({ success: true, message: 'Member removed', data: team });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to remove member', error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
}

export default new TeamController();