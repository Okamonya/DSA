import { api } from "../../api";
import { EnrollInTrainingModule, TrainingModule } from "./trainingTypes";

export const trainingAPI = {
    // Fetch all training modules
    fetchTrainingModules: async (): Promise<TrainingModule[]> => {
        const response = await api.get(`/api/user-trainings/training-modules`);
        return response.data;
    },

    // Fetch a single training module
    fetchSingleTrainingModule: async (id: string): Promise<TrainingModule> => {
        const response = await api.get(`/api/user-trainings/training-modules/${id}`);
        return response.data;
    },

    // Create a new training module
    createTrainingModule: async (trainingData: Partial<TrainingModule>): Promise<TrainingModule> => {
        const response = await api.post(`/api/user-trainings/training-modules`, trainingData);
        return response.data;
    },

    // Update a training module
    updateTrainingModule: async (id: string, data: Partial<TrainingModule>): Promise<TrainingModule> => {
        const response = await api.put(`/api/user-trainings/training-modules/${id}`, data);
        return response.data;
    },

    // Delete a training module
    deleteTrainingModule: async (id: string): Promise<void> => {
        await api.delete(`/api/user-trainings/training-modules/${id}`);
    },

    // Enroll to a training module
    enrollInTrainingModule: async (enrollData: EnrollInTrainingModule): Promise<TrainingModule> => {
        const response = await api.post(`/api/user-trainings`, enrollData);
        return response.data;
    },

    // Set current training
    setCurrentTraining: async (userId: string, trainingId: string): Promise<void> => {
        await api.put(`/api/user-trainings/current/${userId}`, { trainingId });
    },

    // Get current training for a user
    getCurrentTrainingForUser: async (userId: string): Promise<TrainingModule> => {
        const response = await api.get(`/api/user-trainings/current/${userId}`);
        return response.data;
    },

};
