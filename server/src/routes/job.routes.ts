import { Router } from 'express';
import * as jobCtrl from '../controllers/job.controller';
import * as appCtrl from '../controllers/application.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { adminMiddleware } from '../middleware/admin.middleware';

const router = Router();

// Public
router.get('/', jobCtrl.listJobs);
router.get('/:id', jobCtrl.getJob);

// Admin-only mutations
router.post('/', authMiddleware, adminMiddleware, jobCtrl.createJob);
router.put('/:id', authMiddleware, adminMiddleware, jobCtrl.updateJob);
router.delete('/:id', authMiddleware, adminMiddleware, jobCtrl.deleteJob);

// Auth user actions
router.post('/:id/apply', authMiddleware, appCtrl.applyToJob);
router.post('/:id/save', authMiddleware, appCtrl.saveJob);
router.delete('/:id/save', authMiddleware, appCtrl.unsaveJob);

// Admin: view applicants
router.get('/:jobId/applications', authMiddleware, adminMiddleware, appCtrl.getJobApplications);

export default router;
