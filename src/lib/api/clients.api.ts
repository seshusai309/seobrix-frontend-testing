import { api } from './client';
import { Client, Project } from '@/types';

export const clientsApi = {
  list: async (): Promise<Client[]> => {
    const { data } = await api.get('/clients');
    return data.data;
  },

  getById: async (id: string): Promise<Client> => {
    const { data } = await api.get(`/clients/${id}`);
    return data.data;
  },

  update: async (id: string, payload: Partial<{ name: string; industry: string }>): Promise<Client> => {
    const { data } = await api.patch(`/clients/${id}`, payload);
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },

  // Move a client (and its projects) to another workspace; staff assignments revoked.
  move: async (id: string, workspaceId: string): Promise<Client> => {
    const { data } = await api.post(`/clients/${id}/move`, { workspaceId });
    return data.data;
  },

  // ── Projects under a client ───────────────────────────────────────────────
  listProjects: async (clientId: string): Promise<Project[]> => {
    const { data } = await api.get(`/clients/${clientId}/projects`);
    return data.data;
  },

  // CLIENT only: create a project (website) under their own client.
  createProject: async (
    clientId: string,
    payload: { name: string; websiteUrl: string; description?: string }
  ): Promise<Project> => {
    const { data } = await api.post(`/clients/${clientId}/projects`, payload);
    return data.data;
  },
};
