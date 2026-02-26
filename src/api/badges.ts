/**
 * Badges API service
 * CRUD operations for badges and achievements
 */

import { apiClient } from './client';
import type {
  Badge,
  CreateBadgeDto,
  UpdateBadgeDto,
  Achievement,
  CreateAchievementDto,
  UpdateAchievementDto,
  UserBadge,
  UserAchievement,
} from '../types/badges';

// ==================== BADGES ====================

/**
 * Get all badges
 * @param category - Optional category to filter by
 * @param earned - Optional "true"/"false" to filter by earned status
 */
export const getBadges = async (category?: string, earned?: string): Promise<Badge[]> => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (earned) params.append('earned', earned);

  const queryString = params.toString();
  return apiClient.get<Badge[]>(`/badges${queryString ? `?${queryString}` : ''}`);
};

/**
 * Get a single badge by ID
 */
export const getBadge = async (id: string): Promise<Badge> => {
  return apiClient.get<Badge>(`/badges/${id}`);
};

/**
 * Create a new badge
 */
export const createBadge = async (data: CreateBadgeDto): Promise<Badge> => {
  return apiClient.post<Badge>('/badges', data);
};

/**
 * Update an existing badge
 */
export const updateBadge = async (id: string, data: UpdateBadgeDto): Promise<Badge> => {
  return apiClient.patch<Badge>(`/badges/${id}`, data);
};

/**
 * Delete a badge
 */
export const deleteBadge = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/badges/${id}`);
};

/**
 * Get current user's badges
 */
export const getMyBadges = async (): Promise<UserBadge[]> => {
  return apiClient.get<UserBadge[]>('/badges/my-badges');
};

/**
 * Award a badge to a user
 */
export const earnBadge = async (badgeId: string): Promise<UserBadge> => {
  return apiClient.post<UserBadge>(`/badges/earn/${badgeId}`, {});
};

/**
 * Check if user has earned a badge
 */
export const checkBadgeStatus = async (badgeId: string): Promise<{ earned: boolean; earnedAt?: string }> => {
  return apiClient.get<{ earned: boolean; earnedAt?: string }>(`/badges/check/${badgeId}`);
};

// ==================== ACHIEVEMENTS ====================

/**
 * Get all achievements
 */
export const getAchievements = async (): Promise<Achievement[]> => {
  return apiClient.get<Achievement[]>('/achievements');
};

/**
 * Get a single achievement by ID
 */
export const getAchievement = async (id: string): Promise<Achievement> => {
  return apiClient.get<Achievement>(`/achievements/${id}`);
};

/**
 * Create a new achievement
 */
export const createAchievement = async (data: CreateAchievementDto): Promise<Achievement> => {
  return apiClient.post<Achievement>('/achievements', data);
};

/**
 * Update an existing achievement
 */
export const updateAchievement = async (id: string, data: UpdateAchievementDto): Promise<Achievement> => {
  return apiClient.patch<Achievement>(`/achievements/${id}`, data);
};

/**
 * Delete an achievement
 */
export const deleteAchievement = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/achievements/${id}`);
};

/**
 * Get current user's achievements with progress
 */
export const getMyAchievements = async (): Promise<UserAchievement[]> => {
  return apiClient.get<UserAchievement[]>('/achievements/my-achievements');
};
