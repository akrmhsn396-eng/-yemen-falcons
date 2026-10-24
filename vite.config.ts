import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command }) => {
  const isProd = command === 'build';
  return {
    plugins: [
      react(), 
      tailwindcss(),
      ...(isProd ? [
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
          manifest: {
            id: '/',
            name: 'صقور اليمن: نزاع الشوارع',
            short_name: 'صقور اليمن',
            description: 'لعبة قتال ثلاثية الأبعاد واقعية تجسد تفاصيل المدن والجبال اليمنية.',
            theme_color: '#0a0a0a',
            background_color: '#0a0a0a',
            display: 'standalone',
            start_url: '/',
            scope: '/',
            icons: [
              {
                src: '/src/assets/images/pwa_icon_square_1792876837804.jpg',
                sizes: '512x512',
                type: 'image/jpeg',
                purpose: 'any',
              },
              {
                src: '/src/assets/images/pwa_icon_square_1792876837804.jpg',
                sizes: '512x512',
                type: 'image/jpeg',
                purpose: 'maskable',
              },
            ],
          },
        }),
      ] : []),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: false,
    },
  };
});
