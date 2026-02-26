/**
 * Stages API service
 * CRUD operations for learning stages
 */

import { apiClient } from './client';
import type {
  Stage,
  CreateStageDto,
  UpdateStageDto,
} from '../types/stages';

/**
 * Get all stages
 * @param categoryId - Optional category ID to filter by
 */
export const getStages = async (categoryId?: string): Promise<Stage[]> => {
  const params = categoryId ? `?categoryId=${categoryId}` : '';
  return apiClient.get<Stage[]>(`/stages${params}`);
};

/**
 * Get a single stage by ID
 */
export const getStage = async (id: string): Promise<Stage> => {
  return apiClient.get<Stage>(`/stages/${id}`);
};

/**
 * Create a new stage
 */
export const createStage = async (data: CreateStageDto): Promise<Stage> => {
  return apiClient.post<Stage>('/stages', data);
};

/**
 * Update an existing stage
 */
export const updateStage = async (id: string, data: UpdateStageDto): Promise<Stage> => {
  return apiClient.patch<Stage>(`/stages/${id}`, data);
};

/**
 * Delete a stage
 */
export const deleteStage = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/stages/${id}`);
};
