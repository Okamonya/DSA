import { createAsyncThunk } from "@reduxjs/toolkit";
import { CapturedMessages, Resource } from "./resourcesTypes";
import { resourceAPI } from "./resourceAPIs";

export const fetchResources = createAsyncThunk<Resource[], void, { rejectValue: CapturedMessages }>(
    "resources/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await resourceAPI.fetchAll();
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);



export const fetchResourceById = createAsyncThunk<Resource, number, { rejectValue: CapturedMessages }>(
    "resources/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            return await resourceAPI.fetchById(id);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);



export const createResource = createAsyncThunk<Resource, Omit<Resource, "id">, { rejectValue: CapturedMessages }>(
    "resources/create",
    async (newResource, { rejectWithValue }) => {
        try {
            return await resourceAPI.create(newResource);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);


export const updateResource = createAsyncThunk<
    Resource,
    { id: number; updatedData: Partial<Resource> },
    { rejectValue: CapturedMessages }
>("resources/update", async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        return await resourceAPI.update(id, updatedData);
    } catch (error: any) {
        if (!error.response) throw error;
        return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
    }
});

export const deleteResource = createAsyncThunk<
    { message: string },
    number,
    { rejectValue: CapturedMessages }
>("resources/delete", async (id, { rejectWithValue }) => {
    try {
        return await resourceAPI.delete(id);
    } catch (error: any) {
        if (!error.response) throw error;
        return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
    }
});

