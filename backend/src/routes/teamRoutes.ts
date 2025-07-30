import { Router } from 'express';
import TeamController from '../controller/teamController';

class TeamRoutes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post('/create', TeamController.createTeam);
    this.router.get('/all', TeamController.getTeams);
    this.router.get('/:id', TeamController.getTeam);
    this.router.put('/:id', TeamController.updateTeam);
    this.router.delete('/:id', TeamController.deleteTeam);
    this.router.post('/:id/members', TeamController.addMember);
    this.router.delete('/:id/members', TeamController.removeMember);
  }
}
export default new TeamRoutes();