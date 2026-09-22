import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller';
import { authRateLimiter } from '../middleware/rateLimiter.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', authRateLimiter, authCtrl.register);
router.post('/login', authRateLimiter, authCtrl.login);
router.post('/refresh', authRateLimiter, authCtrl.refresh);
router.post('/logout', authMiddleware, authCtrl.logout);

export default router;
