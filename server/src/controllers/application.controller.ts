import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as appService from '../services/application.service';
import { applyJobSchema, updateStatusSchema } from '../validators/application.validator';
import { sendSuccess } from '../utils/response.utils';

export const applyToJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = applyJobSchema.parse(req.body);
    const application = await appService.applyToJob(req.user!.userId, req.params.id, input);
    return sendSuccess(res, application, 'Application submitted', 201);
  } catch (err) {
    return next(err);
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const applications = await appService.getUserApplications(req.user!.userId);
    return sendSuccess(res, applications);
  } catch (err) {
    return next(err);
  }
};

export const getJobApplications = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const applications = await appService.getJobApplications(req.params.jobId);
    return sendSuccess(res, applications);
  } catch (err) {
    return next(err);
  }
};

export const updateApplicationStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateStatusSchema.parse(req.body);
    const application = await appService.updateApplicationStatus(req.params.id, input);
    return sendSuccess(res, application, 'Status updated');
  } catch (err) {
    return next(err);
  }
};

export const saveJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const saved = await appService.saveJob(req.user!.userId, req.params.id);
    return sendSuccess(res, saved, 'Job saved', 201);
  } catch (err) {
    return next(err);
  }
};

export const unsaveJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await appService.unsaveJob(req.user!.userId, req.params.id);
    return sendSuccess(res, null, 'Job removed from saved');
  } catch (err) {
    return next(err);
  }
};

export const getSavedJobs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const saved = await appService.getSavedJobs(req.user!.userId);
    return sendSuccess(res, saved);
  } catch (err) {
    return next(err);
  }
};

export const getAdminStats = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await appService.getAdminStats();
    return sendSuccess(res, stats);
  } catch (err) {
    return next(err);
  }
};
