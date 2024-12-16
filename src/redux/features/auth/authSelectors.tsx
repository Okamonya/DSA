import { RootState } from "../store";

// Selector to get the current user
export const selectUser = (state: RootState) => state.auth.user;

// Selector to get the authentication status (true if logged in)
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

// Selector to check if the app is loading (e.g., during login)
export const selectAuthLoading = (state: RootState) => state.auth.loading;

// Selector to get any authentication errors
export const selectAuthError = (state: RootState) => state.auth.error;


// Selector to get any authentication errors
export const selectToken = (state: RootState) => state.auth.token;
