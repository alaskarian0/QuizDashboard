/**
 * Categories API service
 * CRUD operations for quiz categories
 */

import { apiClient } from '../lib/api-client';
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../types/categories';

/**
 * Get all categories
 */
export const getCategories = async (): Promise<Category[]> => {
  return apiClient.get<Category[]>('/categories');
};

/**
 * Get a single category by ID
 */
export const getCategory = async (id: string): Promise<Category> => {
  return apiClient.get<Category>(`/categories/${id}`);
};

/**
 * Create a new category
 */
export const createCategory = async (
  categoryData: CreateCategoryDto
): Promise<Category> => {
  return apiClient.post<Category>('/categories', categoryData);
};

/**
 * Update an existing category
 */
export const updateCategory = async (
  id: string,
  categoryData: UpdateCategoryDto
): Promise<Category> => {
  return apiClient.patch<Category>(`/categories/${id}`, categoryData);
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/categories/${id}`);
};
