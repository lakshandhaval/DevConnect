export type UserRole = 'user' | 'admin';
export type ExperienceLevel = 'junior' | 'mid' | 'senior' | 'lead';
export type JobType = 'full-time' | 'part-time' | 'remote' | 'contract';
export type ApplicationStatus = 'applied' | 'under_review' | 'shortlisted' | 'rejected' | 'hired';

export interface Skill {
  id: string;
  name: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio: string | null;
  location: string | null;
  resumeUrl: string | null;
  experienceLevel: ExperienceLevel | null;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  jobType: JobType;
  postedBy: Partial<User> | null;
  postedById: string | null;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  job: Job;
  user?: User;
  status: ApplicationStatus;
  coverLetter: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  job: Job;
  createdAt: string;
}

export interface PaginatedJobs {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface JobFilters {
  search?: string;
  location?: string;
  jobType?: JobType | '';
  skillId?: string;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
}
