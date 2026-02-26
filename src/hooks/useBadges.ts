/**
 * React Query hooks for Badges API
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import * as badgesApi from '../api/badges';
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

// ==================== BADGE QUERY KEYS ====================

export const badgeKeys = {
  all: ['badges'] as const,
  lists: () => [...badgeKeys.all, 'list'] as const,
  list: (category?: string, earned?: string) => [...badgeKeys.lists(), category, earned] as const,
  details: () => [...badgeKeys.all, 'detail'] as const,
  detail: (id: string) => [...badgeKeys.details(), id] as const,
  my: () => [...badgeKeys.all, 'my'] as const,
};

// ==================== BADGE HOOKS ====================

/**
 * Hook to fetch all badges
 */
export function useBadges(category?: string, earned?: string, options?: Omit<UseQueryOptions<Badge[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: badgeKeys.list(category, earned),
    queryFn: () => badgesApi.getBadges(category, earned),
    ...options,
  });
}

/**
 * Hook to fetch a single badge by ID
 */
export function useBadge(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: badgeKeys.detail(id),
    queryFn: () => badgesApi.getBadge(id),
    enabled: enabled ?? !!id,
  });
}

/**
 * Hook to get current user's badges
 */
export function useMyBadges(options?: Omit<UseQueryOptions<UserBadge[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: badgeKeys.my(),
    queryFn: () => badgesApi.getMyBadges(),
    ...options,
  });
}

/**
 * Hook to create a new badge
 */
export function useCreateBadge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBadgeDto) => badgesApi.createBadge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: badgeKeys.lists() });
    },
  });
}

/**
 * Hook to update a badge
 */
export function useUpdateBadge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBadgeDto }) =>
      badgesApi.updateBadge(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: badgeKeys.details() });
      queryClient.invalidateQueries({ queryKey: badgeKeys.lists() });
    },
  });
}

/**
 * Hook to delete a badge
 */
export function useDeleteBadge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => badgesApi.deleteBadge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: badgeKeys.lists() });
    },
  });
}

/**
 * Hook to earn a badge
 */
export function useEarnBadge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (badgeId: string) => badgesApi.earnBadge(badgeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: badgeKeys.my() });
    },
  });
}

// ==================== ACHIEVEMENT QUERY KEYS ====================

export const achievementKeys = {
  all: ['achievements'] as const,
  lists: () => [...achievementKeys.all, 'list'] as const,
  details: () => [...achievementKeys.all, 'detail'] as const,
  detail: (id: string) => [...achievementKeys.details(), id] as const,
  my: () => [...achievementKeys.all, 'my'] as const,
};

// ==================== ACHIEVEMENT HOOKS ====================

/**
 * Hook to fetch all achievements
 */
export function useAchievements(options?: Omit<UseQueryOptions<Achievement[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: achievementKeys.lists(),
    queryFn: () => badgesApi.getAchievements(),
    ...options,
  });
}

/**
 * Hook to fetch a single achievement by ID
 */
export function useAchievement(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: achievementKeys.detail(id),
    queryFn: () => badgesApi.getAchievement(id),
    enabled: enabled ?? !!id,
  });
}

/**
 * Hook to get current user's achievements
 */
export function useMyAchievements(options?: Omit<UseQueryOptions<UserAchievement[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: achievementKeys.my(),
    queryFn: () => badgesApi.getMyAchievements(),
    ...options,
  });
}

/**
 * Hook to create a new achievement
 */
export function useCreateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAchievementDto) => badgesApi.createAchievement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.lists() });
    },
  });
}

/**
 * Hook to update an achievement
 */
export function useUpdateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAchievementDto }) =>
      badgesApi.updateAchievement(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.details() });
      queryClient.invalidateQueries({ queryKey: achievementKeys.lists() });
    },
  });
}

/**
 * Hook to delete an achievement
 */
export function useDeleteAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => badgesApi.deleteAchievement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.lists() });
    },
  });
}
