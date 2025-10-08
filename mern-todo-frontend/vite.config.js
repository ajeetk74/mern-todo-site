import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard Vite configuration for local development and Vercel/similar hosting.
export default defineConfig({
  plugins: [react()],
  // Vercel serves the app from the root
  base: "/",
  server: {
    port: 5173,
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