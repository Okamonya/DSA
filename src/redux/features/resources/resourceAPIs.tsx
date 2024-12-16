import { api } from "../../api";
import { Resource } from "./resourcesTypes";

export const resourceAPI = {
  // Fetch all resources
  fetchAll: async (): Promise<Resource[]> => {
    const response = await api.get("/api/resources");
    return response.data;
  },

  // Fetch a single resource by ID
  fetchById: async (id: number): Promise<Resource> => {
    const response = await api.get(`/api/resources/${id}`);
    return response.data;
  },

  // Create a new resource
  create: async (resource: Omit<Resource, 'id'>): Promise<Resource> => {
    const response = await api.post("/api/resources", resource);
    return response.data;
  },

  // Update an existing resource
  update: async (id: number, resource: Partial<Resource>): Promise<Resource> => {
    const response = await api.put(`/api/resources/${id}`, resource);
    return response.data;
  },

  // Delete a resource
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/resources/${id}`);
    return response.data;
  },
};
