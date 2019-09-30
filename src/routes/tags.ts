import express from 'express';
import TagsController from '../controllers/tags';

const router = express.Router();

router.get('/', TagsController.getRelatedTags);

export default router;
