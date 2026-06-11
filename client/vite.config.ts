import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
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
    plugins: [react()],
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
