import { RootState } from "../store";

export const selectAnnouncements = (state: RootState) => state.announcements.announcements;
export const selectAnnouncementLoading = (state: RootState) => state.announcements.loading;
export const selectAnnouncementError = (state: RootState) => state.announcements.error;
