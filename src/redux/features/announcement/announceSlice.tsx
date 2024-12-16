import { createSlice } from "@reduxjs/toolkit";
import { AnnouncementState } from "./announceTypes";
import { createAnnouncement, deleteAnnouncement, fetchAnnouncementById, fetchAnnouncements, updateAnnouncement } from "./announceActions";

const initialState: AnnouncementState = {
    announcements: [],
    announcement: null,
    loading: false,
    error: null,
};

const announcementSlice = createSlice({
    name: "announcements",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch Announcements
        builder.addCase(fetchAnnouncements.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAnnouncements.fulfilled, (state, action) => {
            state.loading = false;
            state.announcements = action.payload;
        });
        builder.addCase(fetchAnnouncements.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to fetch announcements.";
        });

        // Fetch Announcements
        builder.addCase(fetchAnnouncementById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAnnouncementById.fulfilled, (state, action) => {
            state.loading = false;
            state.announcement = action.payload;
        });
        builder.addCase(fetchAnnouncementById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to fetch announcements.";
        });

        // Create Announcement
        builder.addCase(createAnnouncement.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createAnnouncement.fulfilled, (state, action) => {
            state.loading = false;
            state.announcements.push(action.payload);
        });
        builder.addCase(createAnnouncement.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to create announcement.";
        });

        // Update Announcement
        builder.addCase(updateAnnouncement.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateAnnouncement.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.announcements.findIndex((ann) => ann.id === action.payload.id);
            if (index !== -1) state.announcements[index] = action.payload;
        });
        builder.addCase(updateAnnouncement.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to update announcement.";
        });

        // Delete Announcement
        builder.addCase(deleteAnnouncement.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteAnnouncement.fulfilled, (state, action) => {
            state.loading = false;
            state.announcements = state.announcements.filter((ann) => ann.id !== action.meta.arg);
        });
        builder.addCase(deleteAnnouncement.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to delete announcement.";
        });
    },
});

export default announcementSlice.reducer;
