import { Router } from 'express';
import * as userCtrl from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/skills', userCtrl.getAllSkills);
router.get('/me', authMiddleware, userCtrl.getMe);
router.put('/me', authMiddleware, userCtrl.updateMe);
router.post('/me/skills', authMiddleware, userCtrl.addSkill);
router.delete('/me/skills/:skillId', authMiddleware, userCtrl.removeSkill);

export default router;
