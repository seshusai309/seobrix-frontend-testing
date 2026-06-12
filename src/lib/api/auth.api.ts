import { api } from './client';
import { AuthResponse, User } from '@/types';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data;
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  me: async (): Promise<User> => {
    const { data } = await api.get('/auth/me');
    return data.data;
  },

  // ── Email signup flow ─────────────────────────────────────────────────────

  checkEmail: async (email: string): Promise<{ status: string }> => {
    const { data } = await api.post('/auth/register/check-email', { email });
    return data.data;
  },

  register: async (body: {
    name: string;
    email: string;
    password: string;
    agencyName: string;
  }): Promise<{ message: string; email: string }> => {
    const { data } = await api.post('/auth/register', body);
    return data.data;
  },

  sendOtp: async (email: string): Promise<{ message: string }> => {
    const { data } = await api.post('/auth/send-otp', { email });
    return data.data;
  },

  verifyEmailOtp: async (email: string, otp: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    return data.data;
  },

  // ── SMS OTP flow ──────────────────────────────────────────────────────────

  sendSmsOtp: async (phone: string): Promise<{ message: string }> => {
    const { data } = await api.post('/auth/send-sms-otp', { phone });
    return data.data;
  },

  verifySmsOtp: async (
    phone: string,
    code: string
  ): Promise<AuthResponse | { status: 'needs_profile'; phoneToken: string }> => {
    const { data } = await api.post('/auth/verify-sms-otp', { phone, code });
    return data.data;
  },

  completePhoneSignup: async (body: {
    phoneToken: string;
    name: string;
    email: string;
    agencyName: string;
  }): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/complete-phone-signup', body);
    return data.data;
  },

  // ── Invite accept flow ────────────────────────────────────────────────────

  validateInvite: async (token: string): Promise<{ email: string; name: string; role: string }> => {
    const { data } = await api.get(`/auth/invite/${token}`);
    return data.data;
  },

  acceptInvite: async (token: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/accept-invite', { token, password });
    return data.data;
  },

  // ── OAuth ────────────────────────────────────────────────────────────────

  getOAuthUrl: (provider: 'google' | 'facebook' | 'microsoft'): string => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
    return `${base}/auth/${provider}`;
  },
};
