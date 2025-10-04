import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for GitHub Pages deployment
export default defineConfig({
  plugins: [react()],
  base: "/mern-todo-site/", // Required for GitHub Pages to serve assets correctly
});
