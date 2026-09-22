import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { createError } from '../middleware/error.middleware';

const userRepo = () => AppDataSource.getRepository(User);

export const registerUser = async (input: RegisterInput) => {
  const existing = await userRepo().findOne({ where: { email: input.email } });
  if (existing) throw createError('Email already in use', 409);

  const passwordHash = await hashPassword(input.password);
  const user = userRepo().create({
    name: input.name,
    email: input.email,
    passwordHash,
    role: input.role || 'user',
    skills: [],
  });
  await userRepo().save(user);

  const payload = { userId: user.id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

export const loginUser = async (input: LoginInput) => {
  const user = await userRepo().findOne({
    where: { email: input.email },
    relations: ['skills'],
  });
  if (!user) throw createError('Invalid credentials', 401);

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) throw createError('Invalid credentials', 401);

  const payload = { userId: user.id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { user: sanitizeUser(user), accessToken, refreshToken };
};

export const refreshTokens = async (refreshToken: string) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await userRepo().findOne({ where: { id: payload.userId } });
    if (!user) throw createError('User not found', 401);

    const newPayload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(newPayload);

    return { accessToken, refreshToken: newRefreshToken };
  } catch {
    throw createError('Invalid refresh token', 401);
  }
};

const sanitizeUser = (user: User) => {
  const { passwordHash: _, ...safe } = user as any;
  return safe;
};
