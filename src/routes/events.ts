import express from 'express';
import EventsController from '../controllers/events';
import AuthMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', EventsController.getEvents);
router.get('/:eventId', EventsController.getEvent);
router.patch('/:eventId/edit', AuthMiddleware.guard, EventsController.updatedEvent);
router.post('/create', AuthMiddleware.guard, EventsController.createEvent);

export default router;
