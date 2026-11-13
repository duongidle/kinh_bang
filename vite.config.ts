import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Kinh Bang',
        short_name: 'Kinh Bang',
        description: 'Mô phỏng nền kinh tế Việt Nam',
        lang: 'vi',
        display: 'standalone',
        background_color: '#0f1113',
        theme_color: '#0f1113',
        icons: [],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] },
    }),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  worker: { format: 'es' },
  test: { environment: 'node', testTimeout: 600000, include: ['tests/**/*.test.ts'] },
});
