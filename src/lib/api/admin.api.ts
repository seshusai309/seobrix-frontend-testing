import { api } from './client';
import { Agency, AgencyStats } from '@/types';

export const adminApi = {
  listAgencies: async (): Promise<Agency[]> => {
    const { data } = await api.get('/admin/agencies');
    return data.data;
  },

  createAgency: async (payload: {
    name: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
  }): Promise<{ agency: Agency; admin: { id: string; email: string; name: string } }> => {
    const { data } = await api.post('/admin/agencies', payload);
    return data.data;
  },

  updateAgency: async (
    id: string,
    payload: Partial<{ name: string; status: 'ACTIVE' | 'SUSPENDED' }>
  ): Promise<Agency> => {
    const { data } = await api.patch(`/admin/agencies/${id}`, payload);
    return data.data;
  },

  agencyStats: async (id: string): Promise<AgencyStats> => {
    const { data } = await api.get(`/admin/agencies/${id}/stats`);
    return data.data;
  },
};
