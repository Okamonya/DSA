import { createSlice } from "@reduxjs/toolkit";
import {
    fetchSingleSession,
    createSession,
    updateSession,
    deleteSession,
    fetchAllSessionsById,
    assignUserToSession,
    fetchAllSessions,
} from "./sessionActions";
import { SessionState } from "./sessionTypes";

const initialState: SessionState = {
    sessions: [],
    sessionsById: [],
    loading: false,
    error: null,
};

const sessionSlice = createSlice({
    name: "sessions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch all sessions
        builder
            .addCase(fetchAllSessions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllSessions.fulfilled, (state, action) => {
                state.loading = false;
                state.sessions = action.payload;
            })
            .addCase(fetchAllSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error fetching sessions";
            });

        // Fetch all sessions
        builder
            .addCase(fetchAllSessionsById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllSessionsById.fulfilled, (state, action) => {
                state.loading = false;
                state.sessionsById = action.payload;
            })
            .addCase(fetchAllSessionsById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error fetching sessions";
            });

        // Fetch single session
        builder
            .addCase(fetchSingleSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSingleSession.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.sessions.findIndex((session) => session.id === action.payload.id);
                if (index !== -1) {
                    state.sessions[index] = action.payload;
                } else {
                    state.sessions.push(action.payload);
                }
            })
            .addCase(fetchSingleSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error fetching the session";
            });

        // Create session
        builder
            .addCase(createSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSession.fulfilled, (state, action) => {
                state.loading = false;
                state.sessions.push(action.payload);
            })
            .addCase(createSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error creating the session";
            });

        // Update session
        builder
            .addCase(updateSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSession.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.sessions.findIndex((session) => session.id === action.payload.id);
                if (index !== -1) {
                    state.sessions[index] = action.payload;
                }
            })
            .addCase(updateSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error updating the session";
            });

        // Delete session
        builder
            .addCase(deleteSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSession.fulfilled, (state, action) => {
                state.loading = false;
                state.sessions = state.sessions.filter((session) => session.id !== action.payload.id);
            })
            .addCase(deleteSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Error deleting the session";
            });
        // Assign user
        builder
            .addCase(assignUserToSession.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(assignUserToSession.fulfilled, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(assignUserToSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'An error occurred';
            });
    },
});

export default sessionSlice.reducer;
