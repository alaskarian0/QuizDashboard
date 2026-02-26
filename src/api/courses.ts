/**
 * Courses API service
 * CRUD operations for quiz courses
 */

import { apiClient } from '../lib/api-client';
import type {
  Course,
  CreateCourseDto,
  UpdateCourseDto,
} from '../types/courses';

/**
 * Get all courses
 */
export const getCourses = async (): Promise<Course[]> => {
  return apiClient.get<Course[]>('/categories');
};

/**
 * Get a single course by ID
 */
export const getCourse = async (id: string): Promise<Course> => {
  return apiClient.get<Course>(`/categories/${id}`);
};

/**
 * Create a new course
 */
export const createCourse = async (
  courseData: CreateCourseDto
): Promise<Course> => {
  return apiClient.post<Course>('/categories', courseData);
};

/**
 * Update an existing course
 */
export const updateCourse = async (
  id: string,
  courseData: UpdateCourseDto
): Promise<Course> => {
  return apiClient.patch<Course>(`/categories/${id}`, courseData);
};

/**
 * Delete a course
 */
export const deleteCourse = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/categories/${id}`);
};
