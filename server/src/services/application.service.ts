import { AppDataSource } from '../config/database';
import { Application } from '../entities/Application';
import { SavedJob } from '../entities/SavedJob';
import { Job } from '../entities/Job';
import { ApplyJobInput, UpdateStatusInput } from '../validators/application.validator';
import { createError } from '../middleware/error.middleware';

const appRepo = () => AppDataSource.getRepository(Application);
const savedRepo = () => AppDataSource.getRepository(SavedJob);
const jobRepo = () => AppDataSource.getRepository(Job);

export const applyToJob = async (userId: string, jobId: string, input: ApplyJobInput) => {
  const job = await jobRepo().findOne({ where: { id: jobId } });
  if (!job) throw createError('Job not found', 404);

  const existing = await appRepo().findOne({ where: { userId, jobId } });
  if (existing) throw createError('You have already applied to this job', 409);

  const application = appRepo().create({
    userId,
    jobId,
    coverLetter: input.coverLetter ?? null,
    status: 'applied',
  });
  return appRepo().save(application);
};

export const getUserApplications = async (userId: string) => {
  return appRepo().find({
    where: { userId },
    relations: ['job', 'job.skills'],
    order: { createdAt: 'DESC' },
  });
};

export const getJobApplications = async (jobId: string) => {
  const job = await jobRepo().findOne({ where: { id: jobId } });
  if (!job) throw createError('Job not found', 404);

  return appRepo().find({
    where: { jobId },
    relations: ['user', 'user.skills'],
    order: { createdAt: 'DESC' },
  });
};

export const updateApplicationStatus = async (
  applicationId: string,
  input: UpdateStatusInput
) => {
  const application = await appRepo().findOne({ where: { id: applicationId } });
  if (!application) throw createError('Application not found', 404);

  application.status = input.status;
  return appRepo().save(application);
};

export const saveJob = async (userId: string, jobId: string) => {
  const job = await jobRepo().findOne({ where: { id: jobId } });
  if (!job) throw createError('Job not found', 404);

  const existing = await savedRepo().findOne({ where: { userId, jobId } });
  if (existing) throw createError('Job already saved', 409);

  const saved = savedRepo().create({ userId, jobId });
  return savedRepo().save(saved);
};

export const unsaveJob = async (userId: string, jobId: string) => {
  const saved = await savedRepo().findOne({ where: { userId, jobId } });
  if (!saved) throw createError('Saved job not found', 404);
  await savedRepo().remove(saved);
};

export const getSavedJobs = async (userId: string) => {
  return savedRepo().find({
    where: { userId },
    relations: ['job', 'job.skills'],
    order: { createdAt: 'DESC' },
  });
};

export const getAdminStats = async () => {
  const totalJobs = await jobRepo().count();
  const totalApplications = await appRepo().count();

  const appsPerJob = await appRepo()
    .createQueryBuilder('app')
    .select('app.jobId', 'jobId')
    .addSelect('COUNT(app.id)', 'count')
    .leftJoin('app.job', 'job')
    .addSelect('job.title', 'jobTitle')
    .addSelect('job.company', 'company')
    .groupBy('app.jobId')
    .addGroupBy('job.title')
    .addGroupBy('job.company')
    .orderBy('count', 'DESC')
    .limit(10)
    .getRawMany();

  return { totalJobs, totalApplications, appsPerJob };
};
