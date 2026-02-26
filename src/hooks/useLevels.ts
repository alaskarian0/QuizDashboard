/**
 * React Query hooks for Levels API
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import * as levelsApi from '../api/levels';
import type { Level, CreateLevelDto, UpdateLevelDto } from '../types/stages';

// Query keys
export const levelKeys = {
  all: ['levels'] as const,
  lists: () => [...levelKeys.all, 'list'] as const,
  list: (stageId?: string) => [...levelKeys.lists(), stageId] as const,
  details: () => [...levelKeys.all, 'detail'] as const,
  detail: (id: string) => [...levelKeys.details(), id] as const,
};

/**
 * Hook to fetch all levels
 */
export function useLevels(stageId?: string, options?: Omit<UseQueryOptions<Level[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: levelKeys.list(stageId),
    queryFn: () => levelsApi.getLevels(stageId),
    ...options,
  });
}

/**
 * Hook to fetch a single level by ID
 */
export function useLevel(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: levelKeys.detail(id),
    queryFn: () => levelsApi.getLevel(id),
    enabled: enabled ?? !!id,
  });
}

/**
 * Hook to create a new level
 */
export function useCreateLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLevelDto) => levelsApi.createLevel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: levelKeys.lists() });
    },
  });
}

/**
 * Hook to update a level
 */
export function useUpdateLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLevelDto }) =>
      levelsApi.updateLevel(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: levelKeys.details() });
      queryClient.invalidateQueries({ queryKey: levelKeys.lists() });
    },
  });
}

/**
 * Hook to delete a level
 */
export function useDeleteLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => levelsApi.deleteLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: levelKeys.lists() });
    },
  });
}
