// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy API requests in development to avoid CORS
      '/api': {
        target: 'http://localhost:8000',  // Use local backend for development
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',  // Keep 'dist' for Render (not 'build')
    sourcemap: true,
    emptyOutDir: true,
  }
})