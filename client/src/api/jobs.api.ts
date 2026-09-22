import api from './axios';
import { ApiResponse, Job, PaginatedJobs, JobFilters } from '../types';

export const getJobs = (filters: JobFilters = {}) =>
  api.get<ApiResponse<PaginatedJobs>>('/jobs', { params: filters });

export const getJob = (id: string) =>
  api.get<ApiResponse<Job>>(`/jobs/${id}`);

export const createJob = (data: Partial<Job> & { skillIds?: string[] }) =>
  api.post<ApiResponse<Job>>('/jobs', data);

export const updateJob = (id: string, data: Partial<Job> & { skillIds?: string[] }) =>
  api.put<ApiResponse<Job>>(`/jobs/${id}`, data);

export const deleteJob = (id: string) =>
  api.delete(`/jobs/${id}`);

export const applyToJob = (id: string, coverLetter?: string) =>
  api.post(`/jobs/${id}/apply`, { coverLetter });

export const saveJob = (id: string) =>
  api.post(`/jobs/${id}/save`);

export const unsaveJob = (id: string) =>
  api.delete(`/jobs/${id}/save`);
