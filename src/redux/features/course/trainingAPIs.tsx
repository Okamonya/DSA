import { api } from "../../api";
import { EnrollInTrainingModule, TrainingModule, UserTraining } from "./trainingTypes";

export const trainingAPI = {
    // Fetch all training modules
    fetchTrainingModules: async (userId: string): Promise<TrainingModule[]> => {
        const response = await api.get(`/api/user-trainings/training-modules`);
        return response.data;
    },

    
    // Fetch all training modules
    fetchUserTrainings: async (userId: string): Promise<UserTraining[]> => {
        const response = await api.get(`/api/user-trainings/user/${userId}`);
        return response.data;
    },

    // Fetch a single training module
    fetchSingleTrainingModule: async (id: string, userId: string): Promise<TrainingModule> => {
        const response = await api.get(`/api/user-trainings/training-modules/${id}/${userId}`);
        return response.data;
    },

    // Create a new training module
    createTrainingModule: async (trainingData: Partial<TrainingModule>): Promise<TrainingModule> => {
        const response = await api.post(`/api/user-trainings/training-modules`, trainingData);
        return response.data;
    },

    // Update a training module
    updateTrainingModule: async (id: string, userId: string, data: Partial<TrainingModule>): Promise<TrainingModule> => {
        const response = await api.put(`/api/user-trainings/training-modules/${id}/${userId}`, data);
        return response.data;
    },

    // Delete a training module
    deleteTrainingModule: async (id: string, userId: string): Promise<void> => {
        await api.delete(`/api/user-trainings/training-modules/${id}/${userId}`);
    },

    // Enroll to a training module
    enrollInTrainingModule: async (enrollData: EnrollInTrainingModule): Promise<TrainingModule> => {
        const response = await api.post(`/api/user-trainings`, enrollData);
        return response.data;
    },

     // complete training
     completeTraining: async (userId: string, trainingId: string): Promise<void> => {
        await api.put(`/api/user-trainings/complete/${userId}`, { trainingId });
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
