import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/mern-todo-site/", // ✅ Required for GitHub Pages
  plugins: [react()],
  server: {
    proxy: {
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
