import { api } from './client';
import { Agency } from '@/types';

export const agencyApi = {
  getMyAgency: async (): Promise<Agency | null> => {
    const { data } = await api.get('/agency');
    return data.data;
  },

  updateMyAgency: async (payload: { name: string }): Promise<Agency> => {
    const { data } = await api.patch('/agency', payload);
    return data.data;
  },

  setup: async (name: string): Promise<{ agency: Agency; user: any }> => {
    const { data } = await api.post('/agency/setup', { name });
    return data.data;
  },
};
