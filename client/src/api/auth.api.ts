import api from './axios';
import { ApiResponse, User } from '../types';

export const register = (data: { name: string; email: string; password: string; role?: string }) =>
  api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/register', data);

export const login = (data: { email: string; password: string }) =>
  api.post<ApiResponse<{ user: User; accessToken: string }>>('/auth/login', data);

export const logout = () => api.post('/auth/logout');

export const refreshToken = () =>
  api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
