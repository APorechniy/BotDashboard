import { z } from 'zod';

export const RegisterSchema = z.object({
    email: z.string().email('Некорректный формат email'),
    password: z
        .string()
        .min(8, 'Пароль должен быть не менее 8 символов')
        .regex(/[A-Z]/, 'Пароль должен содержать заглавную букву')
        .regex(/[0-9]/, 'Пароль должен содержать цифру'),
    name: z.string().min(2, 'Имя должно быть не менее 2 символов')
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    email: z.string().email('Некорректный формат email'),
    password: z.string().min(1, 'Пароль обязателен')
});

export type LoginInput = z.infer<typeof LoginSchema>;

export interface UserResponse {
    id: string;
    email: string;
    name: string;
    createdAt: string;
}

export interface AuthResponse {
    user: UserResponse;
    message: string;
}