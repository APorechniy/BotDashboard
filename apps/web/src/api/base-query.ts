import { type BaseQueryFn } from '@reduxjs/toolkit/query';
import { type AxiosRequestConfig, type AxiosError } from 'axios';
import { apiClient } from './axios.js';

export const axiosBaseQuery =
    (): BaseQueryFn<
        {
            url: string;
            method?: AxiosRequestConfig['method'];
            data?: AxiosRequestConfig['data'];
            params?: AxiosRequestConfig['params'];
        },
        unknown,
        { status?: number; data?: unknown }
    > =>
        async ({ url, method = 'GET', data, params }) => {
            try {
                const result = await apiClient({ url, method, data, params });
                return { data: result.data };
            } catch (axiosError) {
                const err = axiosError as AxiosError;
                return {
                    error: {
                        status: err.response?.status,
                        data: err.response?.data || err.message
                    }
                };
            }
        };