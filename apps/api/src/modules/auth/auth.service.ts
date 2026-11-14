import { prisma } from '../../lib/prisma.js';
import { PasswordService } from '../../lib/password.js';
import { RegisterInput, LoginInput } from '@app/contracts';
import { type FastifyInstance } from 'fastify';

export class AuthService {
    constructor(private readonly server: FastifyInstance) { }

    public async register(input: RegisterInput) {
        const existing = await prisma.user.findUnique({ where: { email: input.email } });
        if (existing) {
            throw new Error('Пользователь с таким email уже существует');
        }

        const passwordHash = await PasswordService.hash(input.password);
        const user = await prisma.user.create({
            data: {
                email: input.email,
                name: input.name,
                passwordHash
            },
            select: { id: true, email: true, name: true, createdAt: true }
        });

        return user;
    }

    public async login(input: LoginInput, userAgent?: string, ip?: string) {
        const user = await prisma.user.findUnique({ where: { email: input.email } });
        if (!user) {
            throw new Error('Неверные учетные данные');
        }

        const isValid = await PasswordService.verify(user.passwordHash, input.password);
        if (!isValid) {
            throw new Error('Неверные учетные данные');
        }

        const accessToken = this.server.jwt.sign(
            { sub: user.id, email: user.email, role: user.role },
            { expiresIn: '15m' }
        );

        const refreshToken = this.server.jwt.sign(
            { sub: user.id },
            { expiresIn: '7d' }
        );

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await prisma.userSession.create({
            data: {
                userId: user.id,
                refreshToken,
                userAgent,
                ip,
                expiresAt
            }
        });

        return {
            user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt.toISOString() },
            accessToken,
            refreshToken
        };
    }

    public async refresh(oldRefreshToken: string) {
        try {
            this.server.jwt.verify(oldRefreshToken);
        } catch {
            throw new Error('Невалидный refresh токен');
        }

        const session = await prisma.userSession.findUnique({
            where: { refreshToken: oldRefreshToken },
            include: { user: true }
        });

        if (!session || session.expiresAt < new Date()) {
            if (session) {
                await prisma.userSession.delete({ where: { id: session.id } });
            }
            throw new Error('Сессия истекла или не найдена');
        }

        // Ротация токена обновления
        const newAccessToken = this.server.jwt.sign(
            { sub: session.user.id, email: session.user.email, role: session.user.role },
            { expiresIn: '15m' }
        );

        const newRefreshToken = this.server.jwt.sign(
            { sub: session.user.id },
            { expiresIn: '7d' }
        );

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await prisma.userSession.update({
            where: { id: session.id },
            data: {
                refreshToken: newRefreshToken,
                expiresAt
            }
        });

        return {
            user: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.name,
                createdAt: session.user.createdAt.toISOString()
            },
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }

    public async logout(refreshToken: string) {
        if (refreshToken) {
            await prisma.userSession.deleteMany({ where: { refreshToken } });
        }
    }

    public async getMe(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, createdAt: true }
        });
        if (!user) throw new Error('Пользователь не найден');
        return { ...user, createdAt: user.createdAt.toISOString() };
    }
}