import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import * as authService from '../services/auth.service';
import { sendSuccess } from '../utils/response.utils';
import { env } from '../config/env';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = registerSchema.parse(req.body);
    const result = await authService.registerUser(input);
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTS);
    return sendSuccess(
      res,
      { user: result.user, accessToken: result.accessToken },
      'Registration successful',
      201
    );
  } catch (err) {
    return next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.loginUser(input);
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTS);
    return sendSuccess(res, { user: result.user, accessToken: result.accessToken }, 'Login successful');
  } catch (err) {
    return next(err);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }
    const tokens = await authService.refreshTokens(refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTS);
    return sendSuccess(res, { accessToken: tokens.accessToken }, 'Token refreshed');
  } catch (err) {
    return next(err);
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  return sendSuccess(res, null, 'Logged out successfully');
};
