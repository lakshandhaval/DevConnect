import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  company: z.string().min(2).max(200),
  location: z.string().min(2).max(200),
  salaryMin: z.number().int().positive().optional(),
  salaryMax: z.number().int().positive().optional(),
  jobType: z.enum(['full-time', 'part-time', 'remote', 'contract']),
  skillIds: z.array(z.string().uuid()).optional().default([]),
});

export const updateJobSchema = createJobSchema.partial();

export const jobQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  search: z.string().optional(),
  location: z.string().optional(),
  jobType: z.enum(['full-time', 'part-time', 'remote', 'contract']).optional(),
  skillId: z.string().uuid().optional(),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type JobQuery = z.infer<typeof jobQuerySchema>;
