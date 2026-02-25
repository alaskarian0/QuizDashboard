import axios from 'axios';
import type { LoginRequest, LoginResponse, RefreshTokenResponse, User } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance for auth requests
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

/**
 * Login with username and password
 */
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await authApi.post<{ success: boolean; statusCode: number; data: LoginResponse }>('/auth/login', {
    username,
    password,
  });

  const loginData = response.data.data;

  // Store tokens and user data
  if (loginData.access_token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, loginData.access_token);
  }
  if (loginData.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, loginData.refreshToken);
  }
  if (loginData.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(loginData.user));
  }

  return loginData;
};

/**
 * Logout and clear all tokens
 */
export const logout = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Get the current access token
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get the current refresh token
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Get the current user from localStorage
 */
export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Refresh the access token using refresh token
 */
export const refreshToken = async (): Promise<string> => {
  const token = getRefreshToken();
  if (!token) {
    throw new Error('No refresh token available');
  }

  const response = await authApi.post<{ success: boolean; statusCode: number; data: RefreshTokenResponse }>('/auth/refresh', {
    refreshToken: token,
  });

  const refreshData = response.data.data;

  if (refreshData.access_token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, refreshData.access_token);
  }
  if (refreshData.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshData.refreshToken);
  }

  return refreshData.access_token;
};

/**
 * Get current user info from the server
 */
export const getMe = async (): Promise<User> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('No access token available');
  }

  const response = await authApi.get<{ success: boolean; statusCode: number; data: User }>('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Update stored user data (unwrapped from backend response)
  if (response.data.data) {
    localStorage.setItem(USER_KEY, JSON.stringify(response.data.data));
  }

  return response.data.data;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
