import { RootState } from "../store";

export const selectTrainingModules = (state: RootState) => state.training.trainingModules;
export const selectSingleTrainingModule = (state: RootState) => state.training.trainingModule;
export const selectCurrentTraining = (state: RootState) => state.training.currentTraining;
export const selectTrainingLoading = (state: RootState) => state.training.loading;
export const selectTrainingError = (state: RootState) => state.training.error;
