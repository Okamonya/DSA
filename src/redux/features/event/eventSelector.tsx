import { RootState } from "../store";


export const selectEvents = (state: RootState) => state.events.events;
export const selectEvent = (state: RootState) => state.events.event;
export const selectEventLoading = (state: RootState) => state.events.loading;
export const selectEventError = (state: RootState) => state.events.error;
