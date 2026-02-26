/**
 * Levels API service
 * CRUD operations for learning levels
 */

import { apiClient } from './client';
import type {
  Level,
  CreateLevelDto,
  UpdateLevelDto,
} from '../types/stages';

/**
 * Get all levels
 * @param stageId - Optional stage ID to filter by
 */
export const getLevels = async (stageId?: string): Promise<Level[]> => {
  const params = stageId ? `?stageId=${stageId}` : '';
  return apiClient.get<Level[]>(`/levels${params}`);
};

/**
 * Get a single level by ID
 */
export const getLevel = async (id: string): Promise<Level> => {
  return apiClient.get<Level>(`/levels/${id}`);
};

/**
 * Create a new level
 */
export const createLevel = async (data: CreateLevelDto): Promise<Level> => {
  return apiClient.post<Level>('/levels', data);
};

/**
 * Update an existing level
 */
export const updateLevel = async (id: string, data: UpdateLevelDto): Promise<Level> => {
  return apiClient.patch<Level>(`/levels/${id}`, data);
};

/**
 * Delete a level
 */
export const deleteLevel = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/levels/${id}`);
};
