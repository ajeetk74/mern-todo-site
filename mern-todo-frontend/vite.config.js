<<<<<<< HEAD
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/mern-todo-site/",  // ✅ required for GitHub Pages
  plugins: [react()],
  server: {
    proxy: {
      "/todos": "http://localhost:5001", // ✅ local backend proxy
    },
  },
});
=======
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }) => {
  // Load environment variables for current mode
  const env = loadEnv(mode, process.cwd(), "VITE_");

  // Determine base path for deployment
  const base = env.DEPLOY_ENV === "github" ? "/mern-todo-site/" : "/";

  // Configure dev server proxy for local development
  const server = mode === "development" ? {
    proxy: {
      "/todos": {
        target: env.VITE_API_URL || "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
      "/auth": {
        target: env.VITE_API_URL || "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  } : {};

  return defineConfig({
    plugins: [react()],
    base,
    server,
  });
};
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
