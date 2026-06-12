import { api } from './client';
import { Workspace, WorkspaceMember, Client } from '@/types';

export const workspaceApi = {
  list: async (): Promise<Workspace[]> => {
    const { data } = await api.get('/workspaces');
    return data.data;
  },

  getById: async (id: string): Promise<Workspace> => {
    const { data } = await api.get(`/workspaces/${id}`);
    return data.data;
  },

  create: async (payload: { name: string }): Promise<Workspace> => {
    const { data } = await api.post('/workspaces', payload);
    return data.data;
  },

  update: async (id: string, payload: Partial<{ name: string; isActive: boolean }>): Promise<Workspace> => {
    const { data } = await api.patch(`/workspaces/${id}`, payload);
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/workspaces/${id}`);
  },

  // ── Members (staff) ───────────────────────────────────────────────────────
  listMembers: async (id: string): Promise<WorkspaceMember[]> => {
    const { data } = await api.get(`/workspaces/${id}/members`);
    return data.data;
  },

  addMember: async (id: string, userId: string): Promise<WorkspaceMember> => {
    const { data } = await api.post(`/workspaces/${id}/members`, { userId });
    return data.data;
  },

  removeMember: async (id: string, userId: string): Promise<void> => {
    await api.delete(`/workspaces/${id}/members/${userId}`);
  },

  // ── Clients in workspace ──────────────────────────────────────────────────
  listClients: async (id: string): Promise<Client[]> => {
    const { data } = await api.get(`/workspaces/${id}/clients`);
    return data.data;
  },

  createClient: async (id: string, payload: { name: string; industry?: string }): Promise<Client> => {
    const { data } = await api.post(`/workspaces/${id}/clients`, payload);
    return data.data;
  },
};
