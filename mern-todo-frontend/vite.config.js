import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // root for local dev
  server: {
    proxy: {
      "/todos": "http://localhost:5001",
      "/auth": "http://localhost:5001",
    },
  },
});
