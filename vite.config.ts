import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'localhost',
    port: 3000,
    strictPort: false,
    open: true,
    cors: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-avatar', '@radix-ui/react-checkbox'],
          charts: ['recharts'],
          router: ['react-router-dom'],
          flow: ['reactflow'],
          animation: ['framer-motion'],
        }
      }
    },
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 500
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'zustand', 'lucide-react'],
  },
})