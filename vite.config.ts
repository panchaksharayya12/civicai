import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    host: 'localhost',
    strictPort: false,
    cors: true,
  },
  preview: {
    port: 5173,
    host: 'localhost',
    cors: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  }
});
