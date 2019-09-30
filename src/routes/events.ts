import express from 'express';
import EventsController from '../controllers/events';

const router = express.Router();

router.get('/', EventsController.getEvents);
router.get('/:eventId', EventsController.getEvent);

export default router;
