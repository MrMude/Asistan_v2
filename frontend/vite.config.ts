import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Geliştirme sırasında /api istekleri backend'e yönlendirilir,
      // böylece frontend'de CORS uğraşmadan doğrudan fetch("/api/...") kullanılır.
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
