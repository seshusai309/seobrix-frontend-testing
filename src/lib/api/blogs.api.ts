import { api } from './client';
import { Blog, BlogHistory, BlogStatus, Project } from '@/types';

// Blogs are scoped to a PROJECT (project = one website).
export const blogsApi = {
  list: async (projectId: string, status?: BlogStatus): Promise<Blog[]> => {
    const { data } = await api.get(`/projects/${projectId}/blogs`, {
      params: status ? { status } : {},
    });
    return data.data;
  },

  getById: async (projectId: string, id: string): Promise<Blog> => {
    const { data } = await api.get(`/projects/${projectId}/blogs/${id}`);
    return data.data;
  },

  create: async (
    projectId: string,
    payload: { title: string; slug: string; content: string; metaTitle?: string; metaDescription?: string; featuredImageUrl?: string }
  ): Promise<Blog> => {
    const { data } = await api.post(`/projects/${projectId}/blogs`, payload);
    return data.data;
  },

  update: async (projectId: string, id: string, payload: Partial<Blog>): Promise<Blog> => {
    const { data } = await api.patch(`/projects/${projectId}/blogs/${id}`, payload);
    return data.data;
  },

  delete: async (projectId: string, id: string): Promise<void> => {
    await api.delete(`/projects/${projectId}/blogs/${id}`);
  },

  submit: async (projectId: string, id: string): Promise<Blog> => {
    const { data } = await api.post(`/projects/${projectId}/blogs/${id}/submit`);
    return data.data;
  },

  approve: async (projectId: string, id: string): Promise<Blog> => {
    const { data } = await api.post(`/projects/${projectId}/blogs/${id}/approve`);
    return data.data;
  },

  requestChanges: async (projectId: string, id: string, note?: string): Promise<Blog> => {
    const { data } = await api.post(`/projects/${projectId}/blogs/${id}/request-changes`, { note });
    return data.data;
  },

  reject: async (projectId: string, id: string, note?: string): Promise<Blog> => {
    const { data } = await api.post(`/projects/${projectId}/blogs/${id}/reject`, { note });
    return data.data;
  },

  publish: async (projectId: string, id: string, cmsType: 'WORDPRESS' | 'SHOPIFY'): Promise<Blog> => {
    const { data } = await api.post(`/projects/${projectId}/blogs/${id}/publish`, { cmsType });
    return data.data;
  },

  getHistory: async (projectId: string, id: string): Promise<BlogHistory[]> => {
    const { data } = await api.get(`/projects/${projectId}/blogs/${id}/history`);
    return data.data;
  },
};

export const reviewsApi = {
  getQueue: async (): Promise<Blog[]> => {
    const { data } = await api.get('/reviews/queue');
    return data.data;
  },
};

export const portalApi = {
  me: async () => {
    const { data } = await api.get('/portal/me');
    return data.data;
  },
  projects: async (): Promise<Project[]> => {
    const { data } = await api.get('/portal/projects');
    return data.data;
  },
  blogs: async (): Promise<Blog[]> => {
    const { data } = await api.get('/portal/blogs');
    return data.data;
  },
};
