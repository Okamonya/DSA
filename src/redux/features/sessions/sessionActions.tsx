import { createAsyncThunk } from "@reduxjs/toolkit";
import { Session, SessionAssignment } from "./sessionTypes";
import { sessionAPI } from "./sessionAPIs";

// Captured error structure
interface CapturedMessages {
    status_code: number;
    message: string;
}

// Fetch all sessions
export const fetchAllSessions = createAsyncThunk<Session[], { id: string }, { rejectValue: CapturedMessages }>(
    "sessions/fetchAllSessions",
    async ({id}, { rejectWithValue }) => {
        try {
            return await sessionAPI.fetchAllSessions(id);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Fetch all sessions
export const fetchAllSessionsById = createAsyncThunk<Session[], { id: string }, { rejectValue: CapturedMessages }>(
    "sessions/fetchAllById",
    async ({ id }, { rejectWithValue }) => {
        try {
            return await sessionAPI.fetchSessionsById(id);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Fetch a single session
export const fetchSingleSession = createAsyncThunk<Session, { id: string }, { rejectValue: CapturedMessages }>(
    "sessions/fetchSingle",
    async ({ id }, { rejectWithValue }) => {
        try {
            return await sessionAPI.fetchSingleSession(id);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Create a new session
export const createSession = createAsyncThunk<Session, Partial<Session>, { rejectValue: CapturedMessages }>(
    "sessions/create",
    async (sessionData, { rejectWithValue }) => {
        try {
            return await sessionAPI.createSession(sessionData);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Update an existing session
export const updateSession = createAsyncThunk<Session, { id: string; data: Partial<Session> }, { rejectValue: CapturedMessages }>(
    "sessions/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await sessionAPI.updateSession(id, data);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Delete a session
export const deleteSession = createAsyncThunk<{ id: string }, { id: string }, { rejectValue: CapturedMessages }>(
    "sessions/delete",
    async ({ id }, { rejectWithValue }) => {
        try {
            await sessionAPI.deleteSession(id);
            return { id };
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Assign user to session
export const assignUserToSession = createAsyncThunk<any, { menteeId: string; sessionId: string }, { rejectValue: CapturedMessages }>(
    'sessions/assignUser',
    async ({ menteeId, sessionId }, { rejectWithValue }) => {
        try {
            return await sessionAPI.assignUserToSession(menteeId, sessionId);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({
                status_code: error.response.status,
                message: error.response.data.message,
            });
        }
    }
);