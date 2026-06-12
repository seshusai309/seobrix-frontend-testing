import { api } from './client';
import { Integration } from '@/types';

export const integrationApi = {
  list: async (projectId: string): Promise<Integration[]> => {
    const { data } = await api.get(`/projects/${projectId}/integrations`);
    return data.data;
  },

  connectWordPress: async (
    projectId: string,
    payload: { siteUrl: string; username: string; applicationPassword: string }
  ): Promise<Integration> => {
    const { data } = await api.post(`/projects/${projectId}/integrations/wordpress`, payload);
    return data.data;
  },

  connectShopify: async (
    projectId: string,
    payload: { siteUrl: string; accessToken: string }
  ): Promise<Integration> => {
    const { data } = await api.post(`/projects/${projectId}/integrations/shopify`, payload);
    return data.data;
  },

  test: async (projectId: string, id: string): Promise<Integration> => {
    const { data } = await api.post(`/projects/${projectId}/integrations/${id}/test`);
    return data.data;
  },

  remove: async (projectId: string, id: string): Promise<void> => {
    await api.delete(`/projects/${projectId}/integrations/${id}`);
  },
};
