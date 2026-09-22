import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as jobService from '../services/job.service';
import { createJobSchema, updateJobSchema, jobQuerySchema } from '../validators/job.validator';
import { sendSuccess } from '../utils/response.utils';

export const listJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = jobQuerySchema.parse(req.query);
    const result = await jobService.getJobs(query);
    return sendSuccess(res, result);
  } catch (err) {
    return next(err);
  }
};

export const getJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    return sendSuccess(res, job);
  } catch (err) {
    return next(err);
  }
};

export const createJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = createJobSchema.parse(req.body);
    const job = await jobService.createJob(input, req.user!.userId);
    return sendSuccess(res, job, 'Job created', 201);
  } catch (err) {
    return next(err);
  }
};

export const updateJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const input = updateJobSchema.parse(req.body);
    const job = await jobService.updateJob(req.params.id, input);
    return sendSuccess(res, job, 'Job updated');
  } catch (err) {
    return next(err);
  }
};

export const deleteJob = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await jobService.deleteJob(req.params.id);
    return sendSuccess(res, null, 'Job deleted');
  } catch (err) {
    return next(err);
  }
};
