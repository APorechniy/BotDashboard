import { UserResponse } from '@app/contracts';

export interface AuthState {
    user: UserResponse | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
}