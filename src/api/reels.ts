/**
 * Reels API service
 * CRUD operations for user-generated reels
 */

import { apiClient } from './client';
import type {
  UserReel,
  CreateReelDto,
  UpdateReelDto,
} from '../types/reels';

/**
 * Get all reels
 */
export const getReels = async (): Promise<UserReel[]> => {
  return apiClient.get<UserReel[]>('/reels');
};

/**
 * Get active reels
 */
export const getActiveReels = async (): Promise<UserReel[]> => {
  return apiClient.get<UserReel[]>('/reels/active');
};

/**
 * Get reels by user ID
 */
export const getReelsByUser = async (userId: string): Promise<UserReel[]> => {
  return apiClient.get<UserReel[]>(`/reels/user/${userId}`);
};

/**
 * Get a single reel by ID
 */
export const getReel = async (id: string): Promise<UserReel> => {
  return apiClient.get<UserReel>(`/reels/${id}`);
};

/**
 * Create a new reel
 */
export const createReel = async (data: CreateReelDto): Promise<UserReel> => {
  return apiClient.post<UserReel>('/reels', data);
};

/**
 * Update an existing reel
 */
export const updateReel = async (id: string, data: UpdateReelDto): Promise<UserReel> => {
  return apiClient.patch<UserReel>(`/reels/${id}`, data);
};

/**
 * Delete a reel
 */
export const deleteReel = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/reels/${id}`);
};

/**
 * Increment reel view count
 */
export const incrementReelViews = async (id: string): Promise<UserReel> => {
  return apiClient.patch<UserReel>(`/reels/${id}/view`, {});
};
