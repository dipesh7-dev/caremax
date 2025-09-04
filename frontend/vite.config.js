import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// This configuration enables the React plugin and proxies API calls
// during development to your backend server.  When `VITE_API_URL`
// isn't specified the axios client falls back to `/api`, which is
// proxied here to http://localhost:5000 so that cross-origin issues
// are avoided in development.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});