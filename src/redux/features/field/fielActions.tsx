import { createAsyncThunk } from "@reduxjs/toolkit";
import { District, Field } from "./fieldTypes";
import { districtsAPI } from "./fieldAPIs";

interface CapturedMessages {
    status_code: number;
    message: string;
}

// Fetch all districts
export const fetchDistricts = createAsyncThunk<District[], void, { rejectValue: CapturedMessages }>(
    "districts/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            return await districtsAPI.fetchAll();
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Fetch a single district by ID
export const fetchDistrictById = createAsyncThunk<District, number, { rejectValue: CapturedMessages }>(
    "districts/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            return await districtsAPI.fetchById(id);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

// Fetch all fields
export const fetchFields = createAsyncThunk<Field[], void, { rejectValue: CapturedMessages }>(
    "districts/fetchAFields",
    async (_, { rejectWithValue }) => {
        try {
            return await districtsAPI.fetchAllFields();
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);
