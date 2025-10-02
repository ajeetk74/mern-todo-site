import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/mern-todo-site/', // important for GitHub Pages
  plugins: [react()],
  server: {
    proxy: {
      '/todos': 'http://localhost:5001', // works only in local dev
    },
  },
})
