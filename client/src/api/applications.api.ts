import api from './axios';
import { ApiResponse, Application, SavedJob } from '../types';

export const getMyApplications = () =>
  api.get<ApiResponse<Application[]>>('/applications/me');

export const getSavedJobs = () =>
  api.get<ApiResponse<SavedJob[]>>('/applications/saved');

export const updateApplicationStatus = (id: string, status: string) =>
  api.put<ApiResponse<Application>>(`/applications/${id}/status`, { status });

export const getJobApplications = (jobId: string) =>
  api.get<ApiResponse<Application[]>>(`/jobs/${jobId}/applications`);

export const getAdminStats = () =>
  api.get<ApiResponse<{ totalJobs: number; totalApplications: number; appsPerJob: any[] }>>('/admin/stats');
