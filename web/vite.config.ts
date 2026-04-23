import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/line-qr': {
        target: 'https://qr-official.line.me',
        changeOrigin: true,
        rewrite: () => '/g/p/149jddew.png',
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
