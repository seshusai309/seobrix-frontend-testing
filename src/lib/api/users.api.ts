import { api } from './client';
import { User, Role, PendingInvite } from '@/types';

export const usersApi = {
  list: async (): Promise<User[]> => {
    const { data } = await api.get('/users');
    return data.data;
  },

  invite: async (payload: {
    name: string;
    email: string;
    role: Role;
    clientId?: string; // for CLIENT invites
    workspaceIds?: string[]; // for staff invites
  }): Promise<{ message: string; email: string }> => {
    const { data } = await api.post('/users/invite', payload);
    return data.data;
  },

  update: async (id: string, payload: { name?: string; role?: Role; isActive?: boolean }): Promise<User> => {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data.data;
  },

  deactivate: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  listInvites: async (): Promise<PendingInvite[]> => {
    const { data } = await api.get('/users/invites');
    return data.data;
  },

  cancelInvite: async (id: string): Promise<void> => {
    await api.delete(`/users/invites/${id}`);
  },

  resendInvite: async (id: string, email?: string): Promise<{ message: string; email: string }> => {
    const { data } = await api.post(`/users/invites/${id}/resend`, email ? { email } : {});
    return data.data;
  },
};
