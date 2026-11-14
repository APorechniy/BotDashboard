import { type FastifyInstance, type FastifyPluginAsync } from 'fastify';
import { AuthService } from './auth.service.js';
import { RegisterSchema, LoginSchema } from '@app/contracts';

export const authRoutes: FastifyPluginAsync = async (server: FastifyInstance) => {
    const authService = new AuthService(server);

    const cookieOptions = {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const
    };

    server.post('/register', async (request, reply) => {
        const parseResult = RegisterSchema.safeParse(request.body);
        if (!parseResult.success) {
            return reply.status(400).send({ message: 'Ошибка валидации', errors: parseResult.error.flatten() });
        }

        try {
            const user = await authService.register(parseResult.data);
            return reply.status(201).send({ message: 'Регистрация успешна', user });
        } catch (err: any) {
            return reply.status(400).send({ message: err.message });
        }
    });

    server.post('/login', async (request, reply) => {
        const parseResult = LoginSchema.safeParse(request.body);
        if (!parseResult.success) {
            return reply.status(400).send({ message: 'Ошибка валидации', errors: parseResult.error.flatten() });
        }

        try {
            const { user, accessToken, refreshToken } = await authService.login(
                parseResult.data,
                request.headers['user-agent'],
                request.ip
            );

            reply
                .setCookie('access_token', accessToken, { ...cookieOptions, maxAge: 15 * 60 })
                .setCookie('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 })
                .status(200)
                .send({ message: 'Вход выполнен', user });
        } catch (err: any) {
            return reply.status(401).send({ message: err.message });
        }
    });

    server.post('/refresh', async (request, reply) => {
        const refreshToken = request.cookies.refresh_token;
        if (!refreshToken) {
            return reply.status(401).send({ message: 'Refresh токен отсутствует' });
        }

        try {
            const tokens = await authService.refresh(refreshToken);

            reply
                .setCookie('access_token', tokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 })
                .setCookie('refresh_token', tokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 })
                .status(200)
                .send({ message: 'Сессия обновлена', user: tokens.user });
        } catch (err: any) {
            reply.clearCookie('access_token').clearCookie('refresh_token');
            return reply.status(401).send({ message: err.message });
        }
    });

    server.post('/logout', async (request, reply) => {
        const refreshToken = request.cookies.refresh_token;
        if (refreshToken) {
            await authService.logout(refreshToken);
        }
        reply
            .clearCookie('access_token', { path: '/' })
            .clearCookie('refresh_token', { path: '/' })
            .status(200)
            .send({ message: 'Выход выполнен' });
    });

    server.get(
        '/me',
        { preHandler: [server.authenticate] },
        async (request, reply) => {
            try {
                const user = await authService.getMe(request.user.sub);
                return reply.status(200).send({ user });
            } catch (err: any) {
                return reply.status(404).send({ message: err.message });
            }
        }
    );
};