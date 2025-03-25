import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: parseInt(process.env.PORT || '5173')
  },
  preview: {
    host: true,
    port: parseInt(process.env.PORT || '4173'),
    // Allow Railway's health check service to access the server
    allowedHosts: ['healthcheck.railway.app', 'all']
  }
})