import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/base-query.js';
import { LoginInput, RegisterInput, UserResponse, AuthResponse } from '@app/contracts';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        getMe: builder.query<{ user: UserResponse }, void>({
            query: () => ({ url: '/auth/me', method: 'GET' }),
            providesTags: ['Auth']
        }),
        login: builder.mutation<AuthResponse, LoginInput>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                data: credentials
            }),
            invalidatesTags: ['Auth']
        }),
        register: builder.mutation<AuthResponse, RegisterInput>({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                data
            })
        }),
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST'
            }),
            invalidatesTags: ['Auth']
        })
    })
});

export const {
    useGetMeQuery,
    useLazyGetMeQuery,
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation
} = authApi;