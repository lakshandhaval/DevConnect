import { Router } from 'express';
import * as appCtrl from '../controllers/application.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

router.get('/me', authMiddleware, appCtrl.getMyApplications);
router.get('/saved', authMiddleware, appCtrl.getSavedJobs);
router.put('/:id/status', authMiddleware, adminMiddleware, appCtrl.updateApplicationStatus);

export default router;
