import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/auth": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/finances": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
