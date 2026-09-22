import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import * as authApi from '../api/auth.api';
import { refreshToken as refreshTokenApi } from '../api/auth.api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: try to restore session via refresh token cookie
  const restoreSession = useCallback(async () => {
    try {
      const { data } = await refreshTokenApi();
      window.__accessToken = data.data.accessToken;
      // Fetch user profile
      const userApi = await import('../api/user.api');
      const profileRes = await userApi.getMe();
      setUser(profileRes.data.data);
    } catch {
      // No valid session
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login({ email, password });
    window.__accessToken = data.data.accessToken;
    setUser(data.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await authApi.register({ name, email, password });
    window.__accessToken = data.data.accessToken;
    setUser(data.data.user);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      window.__accessToken = undefined;
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
