import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TrainingModule, TrainingState } from "./trainingTypes";
import {
    fetchTrainingModules,
    fetchSingleTrainingModule,
    createTrainingModule,
    updateTrainingModule,
    deleteTrainingModule,
    enrollInTrainingModule,
    setCurrentTraining,
    getCurrentTrainingForUser,
    fetchUserTrainings,
    completeTraining,
} from "./trainingActions";

const initialState: TrainingState = {
    trainingModules: [],
    trainingModule: null,
    userTrainings: [],
    currentTraining: undefined,
    success: false,
    loading: false,
    error: null,
};

const trainingSlice = createSlice({
    name: "training",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all training modules
            .addCase(fetchTrainingModules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTrainingModules.fulfilled, (state, action) => {
                state.loading = false;
                state.trainingModules = action.payload;
            })
            .addCase(fetchTrainingModules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error fetching training modules.";
            })

            // Fetch all training modules
            .addCase(fetchUserTrainings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserTrainings.fulfilled, (state, action) => {
                state.loading = false;
                state.userTrainings = action.payload;
            })
            .addCase(fetchUserTrainings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error fetching training modules.";
            })

            // Fetch single training module
            .addCase(fetchSingleTrainingModule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSingleTrainingModule.fulfilled, (state, action) => {
                state.loading = false;
                state.trainingModule = action.payload;
            })
            .addCase(fetchSingleTrainingModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error fetching training module.";
            })

            // Create a training module
            .addCase(createTrainingModule.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTrainingModule.fulfilled, (state, action) => {
                state.loading = false;
                state.trainingModules.push(action.payload);
            })
            .addCase(createTrainingModule.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error fetching training module.";
            })

            // Enroll in a training module
            .addCase(enrollInTrainingModule.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(enrollInTrainingModule.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(enrollInTrainingModule.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload?.message || "Error fetching training module.";
            })
            // Update a training module
            .addCase(updateTrainingModule.fulfilled, (state, action) => {
                const index = state.trainingModules.findIndex((t) => t.id === action.payload.id);
                if (index !== -1) {
                    state.trainingModules[index] = action.payload;
                }
            })

            
        // complete training
        .addCase(completeTraining.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(completeTraining.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(completeTraining.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to set current training.";
        })

            // Delete a training module
            .addCase(deleteTrainingModule.fulfilled, (state, action) => {
                state.trainingModules = state.trainingModules.filter((t) => t.id !== action.meta.arg.id);
            });

        // Set current training
        builder
            .addCase(setCurrentTraining.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(setCurrentTraining.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(setCurrentTraining.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to set current training.";
            });

        // Get current training
        builder
            .addCase(getCurrentTrainingForUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCurrentTrainingForUser.fulfilled, (state, action: PayloadAction<TrainingModule>) => {
                state.loading = false;
                state.currentTraining = action.payload;
            })
            .addCase(getCurrentTrainingForUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch current training.";
            });
    },
});

export default trainingSlice.reducer;
