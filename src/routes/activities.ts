import express from 'express';
import ActivitiesController from '../controllers/activities';
import AuthMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', ActivitiesController.getActivities);
router.get('/:activityId', ActivitiesController.getActivity);
router.post('/:activityId/register', AuthMiddleware.guard, ActivitiesController.register);

export default router;
