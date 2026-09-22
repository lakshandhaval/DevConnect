import { AppDataSource } from '../config/database';
import { Job } from '../entities/Job';
import { Skill } from '../entities/Skill';
import { CreateJobInput, UpdateJobInput, JobQuery } from '../validators/job.validator';
import { createError } from '../middleware/error.middleware';

const jobRepo = () => AppDataSource.getRepository(Job);
const skillRepo = () => AppDataSource.getRepository(Skill);

export const getJobs = async (query: JobQuery) => {
  const { page, limit, search, location, jobType, skillId, salaryMin, salaryMax } = query;
  const skip = (page - 1) * limit;

  const qb = jobRepo()
    .createQueryBuilder('job')
    .leftJoinAndSelect('job.skills', 'skill')
    .leftJoin('job.postedBy', 'postedBy')
    .addSelect(['postedBy.id', 'postedBy.name'])
    .orderBy('job.createdAt', 'DESC');

  if (search) {
    qb.andWhere(
      '(LOWER(job.title) LIKE :search OR LOWER(job.company) LIKE :search OR LOWER(job.location) LIKE :search)',
      { search: `%${search.toLowerCase()}%` }
    );
  }
  if (location) {
    qb.andWhere('LOWER(job.location) LIKE :location', {
      location: `%${location.toLowerCase()}%`,
    });
  }
  if (jobType) {
    qb.andWhere('job.jobType = :jobType', { jobType });
  }
  if (skillId) {
    qb.andWhere('skill.id = :skillId', { skillId });
  }
  if (salaryMin !== undefined) {
    qb.andWhere('job.salaryMax >= :salaryMin', { salaryMin });
  }
  if (salaryMax !== undefined) {
    qb.andWhere('job.salaryMin <= :salaryMax', { salaryMax });
  }

  const [jobs, total] = await qb.skip(skip).take(limit).getManyAndCount();

  return {
    jobs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getJobById = async (id: string) => {
  const job = await jobRepo().findOne({
    where: { id },
    relations: ['skills', 'postedBy'],
  });
  if (!job) throw createError('Job not found', 404);
  // sanitize postedBy
  if (job.postedBy) {
    const { passwordHash: _, ...safe } = job.postedBy as any;
    (job as any).postedBy = safe;
  }
  return job;
};

export const createJob = async (input: CreateJobInput, adminId: string) => {
  const skills = input.skillIds?.length
    ? await skillRepo().findByIds(input.skillIds)
    : [];

  const job = jobRepo().create({
    title: input.title,
    description: input.description,
    company: input.company,
    location: input.location,
    salaryMin: input.salaryMin ?? null,
    salaryMax: input.salaryMax ?? null,
    jobType: input.jobType,
    postedById: adminId,
    skills,
  });

  return jobRepo().save(job);
};

export const updateJob = async (id: string, input: UpdateJobInput) => {
  const job = await jobRepo().findOne({ where: { id }, relations: ['skills'] });
  if (!job) throw createError('Job not found', 404);

  if (input.skillIds !== undefined) {
    job.skills = input.skillIds.length
      ? await skillRepo().findByIds(input.skillIds)
      : [];
  }

  const { skillIds: _, ...rest } = input;
  Object.assign(job, rest);
  return jobRepo().save(job);
};

export const deleteJob = async (id: string) => {
  const job = await jobRepo().findOne({ where: { id } });
  if (!job) throw createError('Job not found', 404);
  await jobRepo().remove(job);
};
