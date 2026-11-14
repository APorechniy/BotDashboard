import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const webRootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
    root: webRootDir,
    appType: 'spa',
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@app/contracts': fileURLToPath(new URL('../../packages/contracts/src/index.ts', import.meta.url))
        }
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5000',
                changeOrigin: true
            }
        }
    }
});