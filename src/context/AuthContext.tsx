'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types';
import { authApi } from '@/lib/api/auth.api';
import { api } from '@/lib/api/client';

interface AuthCtx {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string, user?: User) => void;
  refreshUser: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrateUser = useCallback(async (token: string) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const me = await authApi.me();
      setUser(me);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const at = localStorage.getItem('accessToken');
    if (at) {
      setAccessToken(at);
      hydrateUser(at).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [hydrateUser]);

  const setTokens = useCallback((at: string, rt: string, u?: User) => {
    localStorage.setItem('accessToken', at);
    localStorage.setItem('refreshToken', rt);
    setAccessToken(at);
    api.defaults.headers.common['Authorization'] = `Bearer ${at}`;
    if (u) setUser(u);
    else hydrateUser(at);
  }, [hydrateUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken: at, refreshToken: rt, user: u } = await authApi.login(email, password);
    setTokens(at, rt);
    setUser(u);
  }, [setTokens]);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete api.defaults.headers.common['Authorization'];
    setAccessToken(null);
    setUser(null);
    window.location.href = '/login';
  }, []);

  const refreshUser = useCallback(async () => {
    const at = localStorage.getItem('accessToken');
    if (!at) return;
    api.defaults.headers.common['Authorization'] = `Bearer ${at}`;
    const me = await authApi.me();
    setUser(me);
  }, []);

  return (
    <Ctx.Provider value={{ user, accessToken, isLoading, login, logout, setTokens, refreshUser }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
