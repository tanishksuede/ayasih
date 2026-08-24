import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import fs from 'fs'

// Vite plugin to execute /api/*.js serverless endpoints in local dev mode (npm run dev)
function viteApiDevPlugin() {
  return {
    name: 'vite-api-dev-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const urlPath = req.url.split('?')[0];
        const fileName = urlPath.replace('/api/', '') + '.js';
        const filePath = path.resolve(process.cwd(), 'api', fileName);

        if (!fs.existsSync(filePath)) {
          return next();
        }

        try {
          // Populate process.env from .env if needed
          const env = loadEnv('development', process.cwd(), '');
          Object.assign(process.env, env);

          // Parse POST body if present
          if (['POST', 'PUT', 'PATCH'].includes(req.method || '')) {
            const buffers: Buffer[] = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const rawBody = Buffer.concat(buffers).toString('utf-8');
            try {
              req.body = JSON.parse(rawBody);
            } catch {
              req.body = {};
            }
          }

          // Polyfill express/vercel response helpers
          if (!res.status) {
            res.status = (code: number) => {
              res.statusCode = code;
              return res;
            };
          }
          if (!res.json) {
            res.json = (data: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };
          }

          const fileUrl = `file://${filePath}?t=${Date.now()}`;
          const handlerModule = await import(fileUrl);
          const handler = handlerModule.default;

          if (typeof handler === 'function') {
            await handler(req, res);
          } else {
            next();
          }
        } catch (err: any) {
          console.error(`[Vite API Dev Plugin Error for ${urlPath}]:`, err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: err.message || 'Internal API Error' }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    viteApiDevPlugin(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      manifest: false,
      devOptions: { enabled: false },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globIgnores: ['**/music/**', '**/*.mp3'],
      },
    })
  ],
  server: {
    host: true, // Exposes the server to the network
  },
  build: {
    chunkSizeWarningLimit: 1200,
  },
  optimizeDeps: {
    include: []
  }
})
