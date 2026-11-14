import { type FastifyInstance, type FastifyRequest, type FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { sub: string; email: string; role: string };
        user: { sub: string; email: string; role: string };
    }
}

export const authPlugin = fp(async (fastify: FastifyInstance) => {
    await fastify.register(fastifyCookie, {
        secret: process.env.COOKIE_SECRET || 'fallback-cookie-secret'
    });

    await fastify.register(fastifyJwt, {
        secret: process.env.JWT_ACCESS_SECRET || 'fallback-jwt-secret',
        cookie: {
            cookieName: 'access_token',
            signed: false
        }
    });

    fastify.decorate(
        'authenticate',
        async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
            try {
                await request.jwtVerify();
            } catch (err) {
                reply.status(401).send({ statusCode: 401, error: 'Unauthorized', message: 'Сессия недействительна' });
            }
        }
    );
});