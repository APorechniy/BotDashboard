import Fastify from 'fastify';
import cors from '@fastify/cors';
import { authPlugin } from './plugins/auth.plugin.js';
import { authRoutes } from './modules/auth/auth.routes.js';

const app = Fastify({
    logger: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
            process.env.NODE_ENV !== 'production'
                ? { target: 'pino-pretty', options: { colorize: true } }
                : undefined
    }
});

await app.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

await app.register(authPlugin);
await app.register(authRoutes, { prefix: '/api/auth' });

const start = async () => {
    try {
        const port = Number(process.env.PORT) || 5000;
        const host = process.env.HOST || '0.0.0.0';
        await app.listen({ port, host });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();