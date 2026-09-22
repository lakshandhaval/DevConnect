import { z } from 'zod';

export const applyJobSchema = z.object({
  coverLetter: z.string().max(5000).optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['applied', 'under_review', 'shortlisted', 'rejected', 'hired']),
});

export type ApplyJobInput = z.infer<typeof applyJobSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
