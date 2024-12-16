import { api } from "../../api";
import { Session } from "./sessionTypes";

export const sessionAPI = {
    // Fetch all sessions
    fetchAllSessions: async (id: string): Promise<Session[]> => {
        const response = await api.get(`/api/sessions/all/${id}`);
        return response.data;
    },

    // Fetch all sessions by id
    fetchSessionsById: async (id: string): Promise<Session[]> => {
        const response = await api.get(`/api/sessions/${id}`);
        return response.data;
    },

    // Fetch a single session
    fetchSingleSession: async (id: string): Promise<Session> => {
        const response = await api.get(`/api/sessions/${id}`);
        return response.data;
    },

    // Create a new session
    createSession: async (sessionData: Partial<Session>): Promise<Session> => {
        const response = await api.post(`/api/sessions`, sessionData);
        return response.data;
    },

    // Update a session
    updateSession: async (id: string, data: Partial<Session>): Promise<Session> => {
        const response = await api.put(`/api/sessions/${id}`, data);
        return response.data;
    },

    // Delete a session
    deleteSession: async (id: string): Promise<void> => {
        await api.delete(`/api/sessions/${id}`);
    },

    // Assign to a session
    assignUserToSession: async (menteeId: string, sessionId: string) => {
        const response = await api.post('/api/sessions/assign', { menteeId, sessionId });
        return response.data;
    },

};

