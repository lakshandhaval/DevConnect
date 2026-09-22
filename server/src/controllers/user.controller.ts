import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as userService from '../services/user.service';
import { updateProfileSchema, addSkillSchema } from '../validators/user.validator';
import { sendSuccess } from '../utils/response.utils';

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.user!.userId);
    return sendSuccess(res, user);
  } catch (err) {
    return next(err);
  }
};

export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateProfileSchema.parse(req.body);
    const user = await userService.updateUserProfile(req.user!.userId, input);
    return sendSuccess(res, user, 'Profile updated');
  } catch (err) {
    return next(err);
  }
};

export const addSkill = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { skillId } = addSkillSchema.parse(req.body);
    const user = await userService.addSkillToUser(req.user!.userId, skillId);
    return sendSuccess(res, user, 'Skill added');
  } catch (err) {
    return next(err);
  }
};

export const removeSkill = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await userService.removeSkillFromUser(req.user!.userId, req.params.skillId);
    return sendSuccess(res, user, 'Skill removed');
  } catch (err) {
    return next(err);
  }
};

export const getAllSkills = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const skills = await userService.getAllSkills();
    return sendSuccess(res, skills);
  } catch (err) {
    return next(err);
  }
};
