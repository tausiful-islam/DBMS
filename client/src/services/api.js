import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://meat-supply-server-5751ph19f-tausifs-projects-09c070a6.vercel.app/api'  // Tested working backend
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if we're not on the landing page or login page
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isPublicPage = ['/', '/login', '/register'].includes(currentPath);
      
      if (!isPublicPage) {
        // Token expired or invalid, only redirect if we're in a protected area
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
