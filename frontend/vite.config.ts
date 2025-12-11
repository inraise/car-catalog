import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({mode}) => {
    const isProduction = mode === 'production';

    return {
        plugins: [react()],
        build: {
            outDir: 'dist',
            emptyOutDir: true,
            sourcemap: false,
            rollupOptions: {
                output: {
                    entryFileNames: 'assets/[name]-[hash].js',
                    chunkFileNames: 'assets/[name]-[hash].js',
                    assetFileNames: 'assets/[name]-[hash].[ext]'
                }
            }
        },
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: 'http://localhost:3000',
                    changeOrigin: true
                }
            }
        },
        base: isProduction ? './' : '/',
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            }
        }
    };
});