/**
 * React Query hooks for Stages API
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import * as stagesApi from '../api/stages';
import type { Stage, CreateStageDto, UpdateStageDto } from '../types/stages';

// Query keys
export const stageKeys = {
  all: ['stages'] as const,
  lists: () => [...stageKeys.all, 'list'] as const,
  list: (categoryId?: string) => [...stageKeys.lists(), categoryId] as const,
  details: () => [...stageKeys.all, 'detail'] as const,
  detail: (id: string) => [...stageKeys.details(), id] as const,
};

/**
 * Hook to fetch all stages
 */
export function useStages(categoryId?: string, options?: Omit<UseQueryOptions<Stage[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: stageKeys.list(categoryId),
    queryFn: () => stagesApi.getStages(categoryId),
    ...options,
  });
}

/**
 * Hook to fetch a single stage by ID
 */
export function useStage(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: stageKeys.detail(id),
    queryFn: () => stagesApi.getStage(id),
    enabled: enabled ?? !!id,
  });
}

/**
 * Hook to create a new stage
 */
export function useCreateStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStageDto) => stagesApi.createStage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stageKeys.lists() });
    },
  });
}

/**
 * Hook to update a stage
 */
export function useUpdateStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStageDto }) =>
      stagesApi.updateStage(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: stageKeys.details() });
      queryClient.invalidateQueries({ queryKey: stageKeys.lists() });
    },
  });
}

/**
 * Hook to delete a stage
 */
export function useDeleteStage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => stagesApi.deleteStage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stageKeys.lists() });
    },
  });
}
