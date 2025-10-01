import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/mern-todo-site/',
  plugins: [react()],
  server: {
    proxy: {
      '/todos': 'http://localhost:5001',
    },
  },
})
