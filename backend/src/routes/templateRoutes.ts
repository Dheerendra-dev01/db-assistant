import { Router } from 'express';
import TemplateController from '../controller/templateController';

class TemplateRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Create a new template
    this.router.post('/create', TemplateController.createTemplate);

    // Get all templates (with filtering and pagination)
    this.router.get('/all', TemplateController.getTemplates);

    // Search templates
    this.router.get('/search', TemplateController.searchTemplates);

    // Get template statistics
    this.router.get('/stats', TemplateController.getTemplateStats);

    // Get a single template by ID
    this.router.get('/:id', TemplateController.getTemplate);

    // Update a template
    this.router.put('/:id', TemplateController.updateTemplate);

    // Delete a template
    this.router.delete('/:id', TemplateController.deleteTemplate);

    // Use a template (increment usage)
    this.router.post('/:id/use', TemplateController.useTemplate);

    // Rate a template
    this.router.post('/:id/rate', TemplateController.rateTemplate);

    // Fork a template
    this.router.post('/:id/fork', TemplateController.forkTemplate);
  }
}

export default new TemplateRoutes(); 