/**
 * React Query hooks for Courses API
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import * as coursesApi from '../api/courses';
import type { Course, CreateCourseDto, UpdateCourseDto } from '../types/courses';

// Query keys
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  detail: (id: string) => [...courseKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch all courses
 * @param options - Additional React Query options
 * @returns Query result with courses data
 *
 * @example
 * ```tsx
 * const { data: courses, isLoading, error, refetch } = useCourses();
 * ```
 */
export function useCourses(options?: Omit<UseQueryOptions<Course[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: courseKeys.all,
    queryFn: () => coursesApi.getCourses(),
    ...options,
  });
}

/**
 * Hook to fetch a single course by ID
 * @param id - Course ID to fetch
 * @param enabled - Whether the query should be enabled
 * @returns Query result with course data
 *
 * @example
 * ```tsx
 * const { data: course, isLoading, error } = useCourse('course-id');
 * ```
 */
export function useCourse(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => coursesApi.getCourse(id),
    enabled: enabled ?? !!id,
  });
}

/**
 * Hook to create a new course
 * @returns Mutation object with createCourse function
 *
 * @example
 * ```tsx
 * const { mutate: createCourse, isPending, error } = useCreateCourse();
 *
 * const handleSubmit = (data) => {
 *   createCourse(data, {
 *     onSuccess: () => {
 *       toast.success('Course created!');
 *     }
 *   });
 * };
 * ```
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCourseDto) => coursesApi.createCourse(data),
    onSuccess: () => {
      // Invalidate and refetch courses list
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}

/**
 * Hook to update a course
 * @returns Mutation object with updateCourse function
 *
 * @example
 * ```tsx
 * const { mutate: updateCourse, isPending, error } = useUpdateCourse();
 *
 * const handleSubmit = (id, data) => {
 *   updateCourse({ id, data }, {
 *     onSuccess: () => {
 *       toast.success('Course updated!');
 *     }
 *   });
 * };
 * ```
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCourseDto }) =>
      coursesApi.updateCourse(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific course and list
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}

/**
 * Hook to delete a course
 * @returns Mutation object with deleteCourse function
 *
 * @example
 * ```tsx
 * const { mutate: deleteCourse, isPending, error } = useDeleteCourse();
 *
 * const handleDelete = (id) => {
 *   deleteCourse(id, {
 *     onSuccess: () => {
 *       toast.success('Course deleted!');
 *     }
 *   });
 * };
 * ```
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => coursesApi.deleteCourse(id),
    onSuccess: () => {
      // Invalidate courses list
      queryClient.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}
