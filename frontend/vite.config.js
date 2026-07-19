import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Optimize React refresh
      fastRefresh: true,
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/gambar': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/storage': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'utils': ['axios'],
          // Split by route
          'pages-admin': [
            '/src/pages/admin/Dashboard',
            '/src/pages/admin/Users',
            '/src/pages/admin/Products'
          ],
          'pages-user': [
            '/src/pages/user/Dashboard',
            '/src/pages/user/Profile'
          ],
          'pages-reseller': [
            '/src/pages/reseller/Dashboard',
            '/src/pages/reseller/Products'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Preload optimizations
    modulePreload: {
      polyfill: true
    }
  },
  // Preload optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  // Base public path - important for production
  base: '/',
  // CSS optimization
  css: {
    devSourcemap: false
  }
});