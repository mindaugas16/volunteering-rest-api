import { Router } from "express";
import AuthRouter from "./auth";
import ActivitiesRouter from "./activities";
import EventsRouter from "./events";
import TagsRouter from "./tags";
import OrganizationsRouter from "./organizations";

const router = Router();

router.use('/auth', AuthRouter);
router.use('/activities', ActivitiesRouter);
router.use('/events', EventsRouter);
router.use('/tags', TagsRouter);
router.use('/organizations', OrganizationsRouter);

export default router;
