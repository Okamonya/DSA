import { createAsyncThunk } from "@reduxjs/toolkit";
import { CapturedMessages, Discussion, Reply } from "./discussionTypes";
import { discussionApis } from "./discussionAPIs";

// Fetch Discussions
export const fetchDiscussions = createAsyncThunk<Discussion[], void, { rejectValue: CapturedMessages }>(
    "discussion/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await discussionApis.fetchDiscussions();
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Fetch Replies for a Discussion
export const fetchReplies = createAsyncThunk<Reply[], string, { rejectValue: CapturedMessages }>(
    "discussion/fetchReplies",
    async (discussionId, { rejectWithValue }) => {
        try {
            return await discussionApis.fetchReplies(discussionId);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Create a Discussion
export const createDiscussion = createAsyncThunk<
    Discussion,
    Discussion,
    { rejectValue: CapturedMessages }
>("discussion/create", async (payload, { rejectWithValue }) => {
    try {
        const newDiscussion = await discussionApis.createDiscussion(payload);

        return newDiscussion;
    } catch (error: any) {
        if (!error.response) throw error;
        return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
    }
});



export const createReply = createAsyncThunk<
    { discussionId: string; reply: Reply },
    { discussionId: string; userId: string; content: string },
    { rejectValue: CapturedMessages }
>("discussion/createReply", async ({ discussionId, userId, content }, { rejectWithValue }) => {
    try {
        const reply = await discussionApis.createReply(discussionId, userId, content);
        return { discussionId, reply };
    } catch (error: any) {
        if (!error.response) throw error;
        return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
    }
});
