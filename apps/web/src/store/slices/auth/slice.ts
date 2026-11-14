import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserResponse, AuthResponse } from '@app/contracts';
import { type AuthState } from './types.js';
import { authApi } from '@/store/services/auth-api.js';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isInitialized: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserResponse | null>) => {
            state.user = action.payload;
            state.isAuthenticated = Boolean(action.payload);
            state.isInitialized = true;
        },
        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isInitialized = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                authApi.endpoints.getMe.matchFulfilled,
                (state, action: PayloadAction<{ user: UserResponse }>) => {
                    state.user = action.payload.user;
                    state.isAuthenticated = true;
                    state.isInitialized = true;
                }
            )
            .addMatcher(
                authApi.endpoints.getMe.matchRejected,
                (state) => {
                    state.user = null;
                    state.isAuthenticated = false;
                    state.isInitialized = true;
                }
            )
            .addMatcher(
                authApi.endpoints.login.matchFulfilled,
                (state, action: PayloadAction<AuthResponse>) => {
                    state.user = action.payload.user;
                    state.isAuthenticated = true;
                    state.isInitialized = true;
                }
            )
            .addMatcher(
                authApi.endpoints.logout.matchFulfilled,
                (state) => {
                    state.user = null;
                    state.isAuthenticated = false;
                    state.isInitialized = true;
                }
            );
    }
});

export const { setUser, clearAuth } = authSlice.actions;