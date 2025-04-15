import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, CapturedMessages } from "./authTypes";
import { fetchUser, forgotPassword, loginUser, logoutUser, register, updateUser } from "./authActions";

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    users: [],
    token: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
        },
        clearForgotPasswordState: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.isAuthenticated = false
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action: PayloadAction<CapturedMessages | undefined>) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload as CapturedMessages;
            });

        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.error = action.payload as CapturedMessages;
            });

        builder
            // forgortpassword
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.error = action.payload as CapturedMessages;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as CapturedMessages;
            });

        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as CapturedMessages;
            });

        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as CapturedMessages;
            });

        // Fetch users
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as CapturedMessages;
            });

    }
});

export const { logout, clearForgotPasswordState } = authSlice.actions;

export default authSlice.reducer;
