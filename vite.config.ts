import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
	  host: '0.0.0.0', // Listen on all network interfaces
	       port: 5173, // Optionally, you can specify the port
	           strictPort: true,
    proxy: {
      '/api': {
        target: 'http://185.146.1.122:3000', // your backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
