import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isProduction = mode === 'production';

    return {
        plugins: [react()],
        base: isProduction ? '/' : '/',
        server: {
            port: 3000,
            host: '0.0.0.0',
            strictPort: true,
            hmr: {
                clientPort: 3000,
                protocol: 'ws',
                host: 'localhost',
                port: 3000
            },
            cors: true,
            proxy: !isProduction ? {
                '/api': {
                    target: env.VITE_API_URL || 'http://localhost:5063',
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, '/api')
                }
            } : undefined,
        },
        build: {
            outDir: 'dist',
            sourcemap: !isProduction,
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['react', 'react-dom', 'react-router-dom'],
                        ui: ['react-hook-form', 'zod'],
                    }
                }
            }
        },
        preview: {
            port: 3000,
            host: '0.0.0.0',
            cors: true,
        },
        define: {
            'process.env': {},
            '__APP_ENV__': JSON.stringify(mode),
        },
        optimizeDeps: {
            include: ['react', 'react-dom', 'react-router-dom']
        }
    };
});