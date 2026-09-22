import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  bio: z.string().max(2000).optional(),
  location: z.string().max(100).optional(),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  experienceLevel: z.enum(['junior', 'mid', 'senior', 'lead']).optional(),
});

export const addSkillSchema = z.object({
  skillId: z.string().uuid(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
