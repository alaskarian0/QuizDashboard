import apiClient from './client';
import type { DashboardStats, DashboardStatsResponse, DashboardError } from '../types/dashboard';

/**
 * Fetches dashboard statistics from the analytics API
 *
 * @returns Promise resolving to dashboard statistics
 * @throws Error if the request fails
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await apiClient.get<DashboardStatsResponse>('/analytics/dashboard');
    return response.data;
  } catch (error) {
    const apiError = error as { response?: { data?: DashboardError } };

    if (apiError.response?.data) {
      throw new Error(apiError.response.data.message || 'Failed to fetch dashboard statistics');
    }

    throw new Error('Network error: Unable to connect to the server. Please check your connection.');
  }
};

/**
 * Dashboard API object containing all dashboard-related endpoints
 */
export const dashboardApi = {
  getDashboardStats,
};

export default dashboardApi;
