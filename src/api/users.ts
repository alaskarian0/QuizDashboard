/**
 * Users API service
 * User management operations
 * Matches backend API endpoints
 */

import { apiClient } from '../lib/api-client';
import type {
  User,
  UserFilters,
  UserStats,
  LeaderboardEntry,
  UpdateUserStatusDto,
  UserRank,
} from '../types/users';

/**
 * Get all users with optional filters
 * GET /users
 */
export const getUsers = async (filters?: UserFilters): Promise<User[]> => {
  const params: Record<string, string | number | boolean | undefined> = {};

  if (filters?.status && filters.status !== 'ALL') {
    params.status = filters.status;
  }
  if (filters?.role) {
    params.role = filters.role;
  }
  if (filters?.search) {
    params.search = filters.search;
  }
  if (filters?.sortBy) {
    params.sortBy = filters.sortBy;
  }
  if (filters?.sortOrder) {
    params.sortOrder = filters.sortOrder;
  }
  if (filters?.page) {
    params.page = filters.page;
  }
  if (filters?.limit) {
    params.limit = filters.limit;
  }

  return apiClient.get<User[]>('/users', params);
};

/**
 * Get a single user by ID
 * GET /users/:id
 */
export const getUser = async (id: string): Promise<User> => {
  return apiClient.get<User>(`/users/${id}`);
};

/**
 * Update user status (ban/unban)
 * PATCH /users/:id/status
 */
export const updateUserStatus = async (
  id: string,
  status: 'ACTIVE' | 'BANNED'
): Promise<User> => {
  return apiClient.patch<User>(`/users/${id}/status`, { status });
};

/**
 * Get user statistics
 * GET /users/:id/stats
 */
export const getUserStats = async (id: string): Promise<UserStats> => {
  return apiClient.get<UserStats>(`/users/${id}/stats`);
};

/**
 * Get leaderboard
 * GET /users/leaderboard
 */
export const getLeaderboard = async (
  limit?: number,
  period?: 'week' | 'month' | 'year'
): Promise<LeaderboardEntry[]> => {
  const params: Record<string, string | number | undefined> = {};

  if (limit) {
    params.limit = limit;
  }
  if (period) {
    params.period = period;
  }

  return apiClient.get<LeaderboardEntry[]>('/users/leaderboard', params);
};

/**
 * Delete a user
 * DELETE /users/:id
 */
export const deleteUser = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/users/${id}`);
};

/**
 * Get current user profile
 * GET /users/me
 */
export const getCurrentUserProfile = async (): Promise<User> => {
  return apiClient.get<User>('/users/me');
};

/**
 * Get current user stats
 * GET /users/me/stats
 */
export const getCurrentUserStats = async (): Promise<UserStats> => {
  return apiClient.get<UserStats>('/users/me/stats');
};

/**
 * Get current user rank
 * GET /users/me/rank
 */
export const getCurrentUserRank = async (): Promise<UserRank> => {
  return apiClient.get<UserRank>('/users/me/rank');
};
