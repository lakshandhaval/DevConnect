import api from './axios';
import { ApiResponse, User, Skill } from '../types';

export const getMe = () =>
  api.get<ApiResponse<User>>('/users/me');

export const updateMe = (data: Partial<User>) =>
  api.put<ApiResponse<User>>('/users/me', data);

export const addSkill = (skillId: string) =>
  api.post<ApiResponse<User>>('/users/me/skills', { skillId });

export const removeSkill = (skillId: string) =>
  api.delete<ApiResponse<User>>(`/users/me/skills/${skillId}`);

export const getAllSkills = () =>
  api.get<ApiResponse<Skill[]>>('/users/skills');
