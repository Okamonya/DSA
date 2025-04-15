import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { authAPI } from "./authAPIs";
import { logout } from "./authSlice";
import { CapturedMessages, User } from "./authTypes";


// Async thunks for login and logout
export const loginUser = createAsyncThunk<any, { email: string; password: string }, { rejectValue: CapturedMessages }>(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await authAPI.login(email, password);
            return response;
        } catch (error: any) {
            if (!error.response) {
                throw error;
            }
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        await authAPI.logout();
        logout()
        return true; // Success
    } catch (error: any) {
        return rejectWithValue(error.response?.data.message || "Logout failed");
    }
});

export const forgotPassword = createAsyncThunk<any, { email: string }, { rejectValue: CapturedMessages }>(
    'auth/forgotPassword',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await authAPI.forgotPassword(email);
            return response;
        } catch (error: any) {
            if (!error.response) {
                throw error;
            }
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);


// Async thunk for user registration
export const register = createAsyncThunk<any, Omit<User, 'id' | 'role'>, { rejectValue: CapturedMessages }>(
    'auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authAPI.register(credentials); // Ensure this returns User
        } catch (error: any) {
            const errorResponse = error.response?.data || { message: 'Unknown error occurred' };
            const status = error.response?.status || 500;

            return rejectWithValue({
                status_code: status,
                message: errorResponse.message,
            });
        }
    }
);

export const updateUser = createAsyncThunk<
    CapturedMessages,
    { formData: Partial<User>; user_id: string },
    { rejectValue: CapturedMessages }
>(
    "auth/update",
    async ({ formData, user_id }, { rejectWithValue }) => {
        try {

            const response = await authAPI.updateUser(formData, user_id);
            return response;
        } catch (error: any) {

            const errorResponse = error.response?.data || { message: "Unknown error occurred" };
            const status = error.response?.status || 500;

            return rejectWithValue({
                status_code: status,
                message: errorResponse.message,
            });
        }
    }
);


// Fetch Users
export const fetchUser = createAsyncThunk<User[], { id: string }, { rejectValue: CapturedMessages }>(
    "auth/fetchuser",
    async ({ id }, { rejectWithValue }) => {
        try {
            return await authAPI.fetchUsers(id);
        } catch (error: any) {
            if (!error.response) throw error;
            return rejectWithValue({ status_code: error.response.status, message: error.response.data.message });
        }
    }
);
