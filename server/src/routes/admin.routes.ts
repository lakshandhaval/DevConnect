import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';
import { getAdminStats } from '../controllers/application.controller';

const router = Router();

router.use(authMiddleware, adminMiddleware);
router.get('/stats', getAdminStats);

export default router;
