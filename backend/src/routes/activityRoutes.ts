import { Router } from 'express';
import ActivityController from '../controller/activityController';

class ActivityRoutes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post('/create', ActivityController.createActivity);
    this.router.get('/all', ActivityController.getActivities);
    this.router.get('/stats', ActivityController.getActivityStats);
    this.router.get('/:id', ActivityController.getActivity);
    this.router.put('/:id', ActivityController.updateActivity);
    this.router.delete('/:id', ActivityController.deleteActivity);
    this.router.patch('/:id/read', ActivityController.markAsRead);
    this.router.patch('/user/:user/read-all', ActivityController.markAllAsRead);
  }
}
export default new ActivityRoutes(); 