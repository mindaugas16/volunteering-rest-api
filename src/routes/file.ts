import express = require('express');
import FilesController from '../controllers/file';

const router = express.Router();

router.post('/upload', FilesController.upload);

export default router;
