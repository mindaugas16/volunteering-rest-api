import express from 'express';
import AuthController from '../controllers/auth';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/sign-up', AuthController.signUp);
router.get('/current-user-info', AuthController.getCurrentUserInfo);

export default router;
