import { api } from './client';
import { Project, ProjectAssignment } from '@/types';

export const projectApi = {
  // Projects assigned to me (SEO_MANAGER / SEO_EXPERT)
  mine: async (): Promise<Project[]> => {
    const { data } = await api.get('/projects/my');
    return data.data;
  },

  getById: async (id: string): Promise<Project> => {
    const { data } = await api.get(`/projects/${id}`);
    return data.data;
  },

  update: async (
    id: string,
    payload: Partial<{ name: string; websiteUrl: string; description: string; isActive: boolean }>
  ): Promise<Project> => {
    const { data } = await api.patch(`/projects/${id}`, payload);
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  // ── Assignments (staff ↔ project) ─────────────────────────────────────────
  listAssignments: async (id: string): Promise<ProjectAssignment[]> => {
    const { data } = await api.get(`/projects/${id}/assignments`);
    return data.data;
  },

  assign: async (id: string, userId: string): Promise<ProjectAssignment> => {
    const { data } = await api.post(`/projects/${id}/assign`, { userId });
    return data.data;
  },

  unassign: async (id: string, userId: string): Promise<void> => {
    await api.delete(`/projects/${id}/assign/${userId}`);
  },
};
