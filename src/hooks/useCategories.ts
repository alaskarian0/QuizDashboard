/**
 * React Query hooks for Categories API
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import * as categoriesApi from '../api/categories';
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../types/categories';

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  detail: (id: string) => [...categoryKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch all categories
 * @param options - Additional React Query options
 * @returns Query result with categories data
 *
 * @example
 * ```tsx
 * const { data: categories, isLoading, error, refetch } = useCategories();
 * ```
 */
export function useCategories(options?: Omit<UseQueryOptions<Category[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => categoriesApi.getCategories(),
    ...options,
  });
}

/**
 * Hook to fetch a single category by ID
 * @param id - Category ID to fetch
 * @param enabled - Whether the query should be enabled
 * @returns Query result with category data
 *
 * @example
 * ```tsx
 * const { data: category, isLoading, error } = useCategory('category-id');
 * ```
 */
export function useCategory(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoriesApi.getCategory(id),
    enabled: enabled ?? !!id,
  });
}

/**
 * Hook to create a new category
 * @returns Mutation object with createCategory function
 *
 * @example
 * ```tsx
 * const { mutate: createCategory, isPending, error } = useCreateCategory();
 *
 * const handleSubmit = (data) => {
 *   createCategory(data, {
 *     onSuccess: () => {
 *       toast.success('Category created!');
 *     }
 *   });
 * };
 * ```
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoriesApi.createCategory(data),
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

/**
 * Hook to update a category
 * @returns Mutation object with updateCategory function
 *
 * @example
 * ```tsx
 * const { mutate: updateCategory, isPending, error } = useUpdateCategory();
 *
 * const handleSubmit = (id, data) => {
 *   updateCategory({ id, data }, {
 *     onSuccess: () => {
 *       toast.success('Category updated!');
 *     }
 *   });
 * };
 * ```
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoriesApi.updateCategory(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific category and list
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

/**
 * Hook to delete a category
 * @returns Mutation object with deleteCategory function
 *
 * @example
 * ```tsx
 * const { mutate: deleteCategory, isPending, error } = useDeleteCategory();
 *
 * const handleDelete = (id) => {
 *   deleteCategory(id, {
 *     onSuccess: () => {
 *       toast.success('Category deleted!');
 *     }
 *   });
 * };
 * ```
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
