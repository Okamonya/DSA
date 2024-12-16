import { createSlice } from "@reduxjs/toolkit";
import {
    createDiscussion,
    createReply,
    fetchDiscussions,
    fetchReplies,
} from "./discussionActions";
import { CapturedMessages, DiscussionState } from "./discussionTypes";
import socket from "../../../util/socket";

const initialState: DiscussionState = {
    discussions: [],
    discussion: null,
    replies: [],
    loading: false,
    error: null,
};

const discussionsSlice = createSlice({
    name: "discussions",
    initialState,
    reducers: {
        addDiscussion: (state, action) => {
            state.discussions.unshift(action.payload); // Real-time discussion updates
        },
        addReply: (state, action) => {
            const { discussionId, reply } = action.payload;
            const discussion = state.discussions.find((d) => d.id === discussionId);
            if (discussion) {
                discussion.replies.push(reply); // Update replies in real-time
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch discussions
            .addCase(fetchDiscussions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDiscussions.fulfilled, (state, action) => {
                state.loading = false;
                state.discussions = action.payload;
            })
            .addCase(fetchDiscussions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as CapturedMessages;
            })
            // Create discussion
            .addCase(createDiscussion.fulfilled, (state, action) => {
                state.discussions.unshift(action.payload);
                socket.emit("newDiscussion", action.payload); // Notify server about new discussion
            })
            // Fetch replies
            .addCase(fetchReplies.fulfilled, (state, action) => {
                state.replies = action.payload;
            })
            .addCase(fetchReplies.rejected, (state, action) => {
                state.error = action.payload as CapturedMessages;
            })
            // Create reply
            .addCase(createReply.fulfilled, (state, action) => {
                const { discussionId, reply } = action.payload;
                const discussion = state.discussions.find((d) => d.id === discussionId);
                if (discussion) {
                    discussion.replies.push(reply);
                    socket.emit("newReply", { discussionId, reply }); // Notify server about new reply
                }
            });
    },
});

export const { addDiscussion, addReply } = discussionsSlice.actions;
export default discussionsSlice.reducer;
