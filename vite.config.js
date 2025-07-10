import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    server: {
        host: 'localhost',
        port: 5173,
        strictPort: true,
        hmr: {
            port: 5173,
            host: 'localhost',
        },
        watch: {
            usePolling: true,
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js'],
    },
    build: {
        rollupOptions: {
            // Remove external configuration for Supabase
        },
    },
    define: {
        global: 'globalThis',
    },
});
