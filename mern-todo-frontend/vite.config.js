import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // ✅ Base path for GitHub Pages
  base: "/mern-todo-site/",
  server: {
    port: 5173,
  },
});
