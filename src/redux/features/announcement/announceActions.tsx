import { createAsyncThunk } from "@reduxjs/toolkit";
import { Announcement, CapturedMessages } from "./announceTypes";
import { announcementAPI } from "./anounceAPIs";

// Fetch Announcements
export const fetchAnnouncements = createAsyncThunk<Announcement[], { id: string }, { rejectValue: CapturedMessages }>(
    "announcements/fetch",
    async ({ id }, { rejectWithValue }) => {
        try {
            return await announcementAPI.fetchAnnouncements(id);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);


export const fetchAnnouncementById = createAsyncThunk<Announcement, { id: string }, { rejectValue: CapturedMessages }>(
    "announcement/fetchById",
    async ({ id }, { rejectWithValue }) => {
        try {
            return await announcementAPI.fetchAnnouncementById(id);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Create Announcement
export const createAnnouncement = createAsyncThunk<Announcement, Omit<Announcement, "id" | "createdAt" | "updatedAt">, { rejectValue: CapturedMessages }>(
    "announcements/create",
    async (data, { rejectWithValue }) => {
        try {
            return await announcementAPI.createAnnouncement(data);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Update Announcement
export const updateAnnouncement = createAsyncThunk<Announcement, { id: string; data: Partial<Announcement> }, { rejectValue: CapturedMessages }>(
    "announcements/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await announcementAPI.updateAnnouncement(id, data);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Delete Announcement
export const deleteAnnouncement = createAsyncThunk<void, string, { rejectValue: CapturedMessages }>(
    "announcements/delete",
    async (id, { rejectWithValue }) => {
        try {
            return await announcementAPI.deleteAnnouncement(id);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);
