// sessionSelectors.ts
import { RootState } from "../store";

export const selectSessions = (state: RootState) => state.sessions.sessions;
export const selectSessionsById = (state: RootState) => state.sessions.sessionsById;
export const selectSessionLoading = (state: RootState) => state.sessions.loading;
export const selectSessionError = (state: RootState) => state.sessions.error;
