import { api } from "../../api";
import { District, Field } from "./fieldTypes";

export const districtsAPI = {
    // Fetch all districts
    fetchAll: async (): Promise<District[]> => {
        const response = await api.get("/api/districts");
        return response.data;
    },

    // Fetch a single district by ID
    fetchById: async (id: number): Promise<District> => {
        const response = await api.get(`/api/districts/${id}`);
        return response.data;
    },

    // Fetch all fields
    fetchAllFields: async (): Promise<Field[]> => {
        const response = await api.get("/api/fields");
        return response.data;
    },
};
