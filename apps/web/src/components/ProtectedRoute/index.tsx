import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useGetMeQuery } from '@/store/services/auth-api.js';
import { useDispatch } from 'react-redux';
import { clearAuth } from '@/store/slices/auth/index.js';

export const ProtectedRoute: React.FC = () => {
    const { data, isLoading, isError } = useGetMeQuery();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleUnauthorized = () => {
            dispatch(clearAuth());
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, [dispatch]);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                Загрузка сессии...
            </div>
        );
    }

    if (isError || !data?.user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};