import { RootState } from "../store";

export const selectDiscussions = (state: RootState) => state.discussions.discussions;
export const selectDiscussionLoading = (state: RootState) => state.discussions.loading;
export const selectDiscussionError = (state: RootState) => state.discussions.error;
