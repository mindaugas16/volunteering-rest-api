import UsersController from '../controllers/users';
import AuthMiddleware from '../middleware/auth';
import router from './auth';

router.get('/current', AuthMiddleware.guard, UsersController.getCurrentUser);
router.patch('/update', AuthMiddleware.guard, UsersController.updateInfo);
router.get('/:id/organizations', UsersController.getUserOrganizations);
router.get('/:id/participation', UsersController.getParticipation);

export default router;
