import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { Skill } from '../entities/Skill';
import { UpdateProfileInput } from '../validators/user.validator';
import { createError } from '../middleware/error.middleware';

const userRepo = () => AppDataSource.getRepository(User);
const skillRepo = () => AppDataSource.getRepository(Skill);

export const getUserById = async (id: string) => {
  const user = await userRepo().findOne({
    where: { id },
    relations: ['skills'],
  });
  if (!user) throw createError('User not found', 404);
  const { passwordHash: _, ...safe } = user as any;
  return safe;
};

export const updateUserProfile = async (id: string, input: UpdateProfileInput) => {
  const user = await userRepo().findOne({ where: { id }, relations: ['skills'] });
  if (!user) throw createError('User not found', 404);

  Object.assign(user, input);
  await userRepo().save(user);
  const { passwordHash: _, ...safe } = user as any;
  return safe;
};

export const addSkillToUser = async (userId: string, skillId: string) => {
  const user = await userRepo().findOne({ where: { id: userId }, relations: ['skills'] });
  if (!user) throw createError('User not found', 404);

  const skill = await skillRepo().findOne({ where: { id: skillId } });
  if (!skill) throw createError('Skill not found', 404);

  const alreadyHas = user.skills.some((s) => s.id === skillId);
  if (alreadyHas) throw createError('Skill already added', 409);

  user.skills.push(skill);
  await userRepo().save(user);
  const { passwordHash: _, ...safe } = user as any;
  return safe;
};

export const removeSkillFromUser = async (userId: string, skillId: string) => {
  const user = await userRepo().findOne({ where: { id: userId }, relations: ['skills'] });
  if (!user) throw createError('User not found', 404);

  user.skills = user.skills.filter((s) => s.id !== skillId);
  await userRepo().save(user);
  const { passwordHash: _, ...safe } = user as any;
  return safe;
};

export const getAllSkills = async () => {
  return skillRepo().find({ order: { name: 'ASC' } });
};
