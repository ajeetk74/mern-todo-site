import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration for Vercel deployment
export default defineConfig({
  plugins: [react()],
  base: "/", // Vercel serves the app from the root
  server: {
    proxy: {
      // Proxy API requests to local backend during development
      "/todos": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
