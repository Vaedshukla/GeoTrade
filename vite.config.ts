import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-simple-maps', 'prop-types']
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:3001'
    }
  }
})
