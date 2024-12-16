import { api } from "../../api";
import { Announcement } from "./announceTypes";

export const announcementAPI = {
    fetchAnnouncements: async (id: string): Promise<Announcement[]> => {
        const response = await api.get(`/api/announcements/${id}`);
        return response.data;
    },
    fetchAnnouncementById: async (id: string): Promise<Announcement> => {
        const response = await api.get(`/api/announcements/single/${id}`);
        return response.data;
    },
    createAnnouncement: async (data: Omit<Announcement, "id" | "createdAt" | "updatedAt">): Promise<Announcement> => {
        const response = await api.post("/api/announcements", data);
        return response.data;
    },
    updateAnnouncement: async (id: string, data: Partial<Announcement>): Promise<Announcement> => {
        const response = await api.put(`/api/announcements/${id}`, data);
        return response.data;
    },
    deleteAnnouncement: async (id: string): Promise<void> => {
        await api.delete(`/api/announcements/${id}`);
    },
};
