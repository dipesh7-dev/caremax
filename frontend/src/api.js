import axios from 'axios';

// Determine the base URL for API requests.  When running in development
// Vite exposes environment variables on `import.meta.env`.  A value
// defined in `.env.development` as `VITE_API_URL` will be used; if
// undefined we fall back to calling the relative `/api` path so that
// proxying defined in vite.config.js still applies.
// If an explicit API URL is provided in the environment use it and
// append `/api` so calls to endpoints like `/auth/login` are routed
// correctly.  Otherwise default to the relative `/api` path so
// vite.config.js can proxy requests during development.
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

// Create an axios instance with the resolved baseURL.  All API
// requests throughout the application will go through this client.
const api = axios.create({ baseURL });

// Attach an Authorization header if a JWT token is stored in
// localStorage.  This interceptor runs before every request and
// ensures that protected endpoints receive the token automatically.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;