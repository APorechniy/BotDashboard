import { type AuthState } from "./types.js";

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsAuthInitialized = (state: { auth: AuthState }) => state.auth.isInitialized;