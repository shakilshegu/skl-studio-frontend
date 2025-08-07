


import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 110000,
});

// Request interceptor - Add token to headers
// In your axios config
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      try {
        // Read from Redux Persist store
        const persistedState = localStorage.getItem('persist:root');
        if (persistedState) {
          const parsed = JSON.parse(persistedState);
          const authData = JSON.parse(parsed.auth); // auth slice is nested
          
          if (authData && authData.token) {
            config.headers.Authorization = `Bearer ${authData.token}`;
          }
        }
      } catch (error) {
        console.error('Error getting token from localStorage:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on 401
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;