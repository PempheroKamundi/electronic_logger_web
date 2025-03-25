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
    // Allow connections from any host in development
    // (useful for testing with mobile devices on the same network)
    host: true,
    // Use PORT env variable if provided, otherwise use 5173
    port: parseInt(process.env.PORT || '5173')
  },
  preview: {
    // Allow preview server to bind to all network interfaces
    host: true,
    // Use PORT env variable provided by Railway
    port: parseInt(process.env.PORT || '4173')
  }
})