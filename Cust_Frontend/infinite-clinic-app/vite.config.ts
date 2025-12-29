import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 5174,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true,
  },
  publicDir: 'public'
})
