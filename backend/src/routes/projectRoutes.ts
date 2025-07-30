import { Router } from 'express';
import ProjectController from '../controller/projectController';

class ProjectRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Create a new project
    this.router.post('/create', ProjectController.createProject);

    // Get all projects (with filtering and pagination)
    this.router.get('/all', ProjectController.getProjects);

    // Get project statistics
    this.router.get('/stats', ProjectController.getProjectStats);

    // Get a single project by ID
    this.router.get('/:id', ProjectController.getProject);

    // Update a project
    this.router.put('/:id', ProjectController.updateProject);

    // Delete a project
    this.router.delete('/:id', ProjectController.deleteProject);

    // Toggle star status
    this.router.patch('/:id/star', ProjectController.toggleStar);

    // Archive/Unarchive project
    this.router.patch('/:id/archive', ProjectController.toggleArchive);

    // Add member to project
    this.router.post('/:id/members', ProjectController.addMember);

    // Remove member from project
    this.router.delete('/:id/members', ProjectController.removeMember);
  }
}

export default new ProjectRoutes(); 