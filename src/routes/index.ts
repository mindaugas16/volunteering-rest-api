import { Router } from 'express';
import cache from '../middleware/cache';
import ActivitiesRouter from './activities';
import AuthRouter from './auth';
import EventsRouter from './events';
import OrganizationsRouter from './organizations';
import TagsRouter from './tags';
import UsersRouter from './users';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/users', UsersRouter);
router.use('/activities', ActivitiesRouter);
router.use('/events', cache, EventsRouter);
router.use('/tags', TagsRouter);
router.use('/organizations', OrganizationsRouter);

export default router;
