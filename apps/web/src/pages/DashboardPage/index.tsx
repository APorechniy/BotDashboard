import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '@/store/services/auth-api.js';
import { useAppSelector } from '@/store/index.js';
import { selectCurrentUser } from '@/store/slices/auth/index.js';
import styles from './index.module.scss';

export const DashboardPage: React.FC = () => {
    const user = useAppSelector(selectCurrentUser);
    const [logout] = useLogoutMutation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout().unwrap();
            navigate('/login', { replace: true });
        } catch {
            navigate('/login', { replace: true });
        }
    };

    return (
        <div className={styles.dashboard}>
            <header className={styles.header}>
                <h1>Управление Telegram-ботами</h1>
                <div className={styles.userInfo}>
                    <span>{user?.email}</span>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        Выйти
                    </button>
                </div>
            </header>
            <main className={styles.content}>
                <h2>Панель состояния</h2>
                <p>Добро пожаловать, {user?.name}. Сессия активна, токены безопасно сохранены в HTTP-Only cookies.</p>
            </main>
        </div>
    );
};