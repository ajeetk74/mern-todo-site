import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

<<<<<<< HEAD
export default defineConfig({
  base: "/mern-todo-site/", // ✅ required for GitHub Pages
  plugins: [react()],
=======
// Vite config for GitHub Pages deployment
export default defineConfig({
  plugins: [react()],
  base: "/mern-todo-site/", // Required for GitHub Pages to serve assets correctly
>>>>>>> 823ce7b (Update frontend and backend: TodoApp, Auth pages, CSS, hover effects, container & footer design)
});
