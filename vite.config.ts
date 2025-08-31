import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        proxy: {
            // '/chat'으로 시작하는 모든 요청을 FastAPI 서버로 전달
            '/chat': {
                target: 'http://127.0.0.1:8000', // FastAPI 서버 주소
                changeOrigin: true,
            },
            // '/token'으로 시작하는 모든 요청을 FastAPI 서버로 전달
            '/token': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
            },
            '/export': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
            },
            '/scenes': {
                target: 'http://127.0.0.1:8000',
                changeOrigin: true,
            },
        }
    }
});
