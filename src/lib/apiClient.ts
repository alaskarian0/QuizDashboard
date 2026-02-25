import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { getAccessToken, removeAccessToken } from './storage';

// Base URL for the API - adjust to your backend URL
const BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      // Handle 401 Unauthorized errors
      if (status === 401) {
        // Token is expired or invalid
        removeAccessToken();

        // If we're not already on the login page, redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Handle 403 Forbidden errors
      if (status === 403) {
        console.error('Access forbidden - insufficient permissions');
      }

      // Handle 500 Server errors
      if (status >= 500) {
        console.error('Server error - please try again later');
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
