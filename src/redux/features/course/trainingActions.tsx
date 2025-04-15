import { createAsyncThunk } from "@reduxjs/toolkit";
import { TrainingModule, CapturedMessages, EnrollInTrainingModule, UserTraining } from "./trainingTypes";
import { trainingAPI } from "./trainingAPIs";

// Fetch all training modules
export const fetchTrainingModules = createAsyncThunk<TrainingModule[], { userId: string }, { rejectValue: CapturedMessages }>(
    "training/fetchAll", async ({ userId }, { rejectWithValue }) => {
        try {
            return await trainingAPI.fetchTrainingModules(userId);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    });

// Fetch all training modules
export const fetchUserTrainings = createAsyncThunk<UserTraining[], { userId: string }, { rejectValue: CapturedMessages }>(
    "training/fetchAllUser", async ({ userId }, { rejectWithValue }) => {
        try {
            return await trainingAPI.fetchUserTrainings(userId);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    });

// Fetch a single training module
export const fetchSingleTrainingModule = createAsyncThunk<TrainingModule, { id: string, userId: string }, { rejectValue: CapturedMessages }>(
    "training/fetchSingle", async ({ id, userId }, { rejectWithValue }) => {
        try {
            return await trainingAPI.fetchSingleTrainingModule(id, userId);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    });

// Create a training module
export const createTrainingModule = createAsyncThunk<TrainingModule, Partial<TrainingModule>, { rejectValue: CapturedMessages }>(
    "training/create", async (training, { rejectWithValue }) => {
        try {
            return await trainingAPI.createTrainingModule(training);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    });

// Update a training module
export const updateTrainingModule = createAsyncThunk<TrainingModule, { id: string; userId: string; training: Partial<TrainingModule> }, { rejectValue: CapturedMessages }>(
    "training/update", async ({ id, userId, training }, { rejectWithValue }) => {
        try {
            return await trainingAPI.updateTrainingModule(id, userId, training);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    });

// Delete a training module
export const deleteTrainingModule = createAsyncThunk<void, { id: string; userId: string; }, { rejectValue: CapturedMessages }>(
    "training/delete", async ({ id, userId }, { rejectWithValue }) => {
        try {
            await trainingAPI.deleteTrainingModule(id, userId);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    });

// Enroll in training module
export const enrollInTrainingModule = createAsyncThunk<TrainingModule, EnrollInTrainingModule, { rejectValue: CapturedMessages }>(
    "training/enroll", async (training, { rejectWithValue }) => {
        try {
            return await trainingAPI.enrollInTrainingModule(training);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    });

// Set current training for a user
export const completeTraining = createAsyncThunk<
    void,
    { userId: string; trainingId: string },
    { rejectValue: CapturedMessages }
>(
    "training/completeTraining",
    async ({ userId, trainingId }, { rejectWithValue }) => {
        try {
            await trainingAPI.completeTraining(userId, trainingId);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Set current training for a user
export const setCurrentTraining = createAsyncThunk<
    void,
    { userId: string; trainingId: string },
    { rejectValue: CapturedMessages }
>(
    "training/setCurrentTraining",
    async ({ userId, trainingId }, { rejectWithValue }) => {
        try {
            await trainingAPI.setCurrentTraining(userId, trainingId);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Get current training for a user
export const getCurrentTrainingForUser = createAsyncThunk<
    TrainingModule,
    { userId: string },
    { rejectValue: CapturedMessages }
>(
    "training/getCurrentTrainingForUser",
    async ({ userId }, { rejectWithValue }) => {
        try {
            return await trainingAPI.getCurrentTrainingForUser(userId);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);
