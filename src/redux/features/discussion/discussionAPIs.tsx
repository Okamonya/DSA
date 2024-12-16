import { api } from "../../api";
import { Discussion, Reply } from "./discussionTypes";

export const discussionApis = {

    fetchDiscussions: async (): Promise<Discussion[]> => {
        const response = await api.get("/api/discussions");
        return response.data;
    },

    fetchReplies: async (discussionId: string): Promise<Reply[]> => {
        const response = await api.get(`/api/discussions/${discussionId}/replies`);
        return response.data;
    },

    createDiscussion: async (data: Discussion): Promise<Discussion> => {
        const response = await api.post("/api/discussions", data);
        return response.data;
    },

    createReply: async (discussionId: string, content: string): Promise<Reply> => {
        const response = await api.post(`/api/discussions/${discussionId}/replies`, { content });
        return response.data;
    }
}
