import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          strategies: 'injectManifest',
          srcDir: 'src',
          filename: 'sw.ts',
          manifest: {
            short_name: 'OD600 Calc',
            name: 'OD600 Dilution Calculator',
            start_url: '.',
            display: 'standalone',
            theme_color: '#1e293b',
            background_color: '#0f172a'
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), '.'),
        }
      }
    };
});
