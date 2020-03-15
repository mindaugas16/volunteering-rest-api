import { Router } from 'express';
import * as path from 'path';
// import cache from '../middleware/cache';
import ActivitiesRouter from './activities';
import AuthRouter from './auth';
import EventsRouter from './events';
import FilesRouter from './file';
import OrganizationsRouter from './organizations';
import TagsRouter from './tags';
import UsersRouter from './users';
import express = require('express');

const router = Router();

router.use('/auth', AuthRouter);
router.use('/users', UsersRouter);
router.use('/activities', ActivitiesRouter);
router.use('/events', EventsRouter);
router.use('/tags', TagsRouter);
router.use('/organizations', OrganizationsRouter);
router.use('/files', FilesRouter);
router.use('/assets/images', express.static(path.join(__dirname, '../assets/images')));

export default router;
