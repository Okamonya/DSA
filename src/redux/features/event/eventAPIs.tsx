import { api } from "../../api";
import { Event } from "./eventTypes";

export const eventAPI = {
    fetchAll: async (id: string): Promise<Event[]> => {
        const response = await api.get(`/api/events/all}`);
        return response.data;
    },

    fetchById: async (id: number): Promise<Event> => {
        const response = await api.get(`/api/events/${id}`);
        return response.data;
    },

    create: async (data: Partial<Event>): Promise<Event> => {
        const response = await api.post("/api/events", data);
        return response.data;
    },

    update: async (id: number, data: Partial<Event>): Promise<Event> => {
        const response = await api.put(`/api/events/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/api/events/${id}`);
    },
};
