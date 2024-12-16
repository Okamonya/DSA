import { RootState } from '../store';

export const selectResources = (state: RootState) => state.resources.resources;
export const selectResourceById = (state: RootState) =>state.resources.resource;
export const selectLoading = (state: RootState) => state.resources.loading;
export const selectError = (state: RootState) => state.resources.error;
