import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, "..");
  const env = loadEnv(mode, envDir, "");
  const apiUrl = env.VITE_API_URL || `http://localhost:${env.SERVER_PORT || "3001"}`;

  if (!process.env.VITE_HTML_LANG) process.env.VITE_HTML_LANG = env.VITE_HTML_LANG || "es";
  if (!process.env.VITE_APP_TITLE) process.env.VITE_APP_TITLE = env.VITE_APP_TITLE || "InclusiApp";

  const apiBypass = (req: { headers?: { accept?: string } }): string | undefined => {
    if (req.headers?.accept?.includes("text/html")) {
      return "/index.html";
    }
    return undefined;
  };

  return {
    envDir,
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        strategies: "generateSW",
        manifest: false,
        base: "/",
        includeAssets: ["favicon.svg", "icon-192.svg", "icon-512.svg", "icon-maskable-512.svg"],
        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,webmanifest,ico,png,jpg,jpeg,woff2}"],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: true,
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/api\//, /^\/auth\//, /^\/finances\//],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "google-fonts-cache",
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "cdn-assets-cache",
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    server: {
      host: true,
      port: parseInt(env.CLIENT_PORT || "5173"),
      proxy: {
        "/auth": {
          target: apiUrl,
          changeOrigin: true,
          cookieDomainRewrite: "localhost",
          secure: false,
          bypass: apiBypass,
        },
        "/finances": {
          target: apiUrl,
          changeOrigin: true,
          cookieDomainRewrite: "localhost",
          secure: false,
          bypass: apiBypass,
        },
      },
    },
  };
});
