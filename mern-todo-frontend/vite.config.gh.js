import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration specifically for GitHub Pages deployment
export default defineConfig({
  plugins: [react()],
  // Needed for GitHub Pages to serve from the sub-directory
  base: "/mern-todo-site/",
});