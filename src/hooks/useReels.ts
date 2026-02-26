/**
 * React Query hooks for Reels API
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import * as reelsApi from '../api/reels';
import type {
  UserReel,
  CreateReelDto,
  UpdateReelDto,
  ReelStatus,
} from '../types/reels';

// Query keys
export const reelKeys = {
  all: ['reels'] as const,
  lists: () => [...reelKeys.all, 'list'] as const,
  list: () => [...reelKeys.lists()] as const,
  active: () => [...reelKeys.all, 'active'] as const,
  user: (userId: string) => [...reelKeys.all, 'user', userId] as const,
  my: () => [...reelKeys.all, 'my'] as const,
  details: () => [...reelKeys.all, 'detail'] as const,
  detail: (id: string) => [...reelKeys.details(), id] as const,
};

/**
 * Helper function to determine reel status
 */
function getReelStatus(reel: UserReel): ReelStatus {
  if (!reel.isActive) return 'inactive';
  if (reel.expiresAt) {
    const now = new Date();
    const expiry = new Date(reel.expiresAt);
    if (now > expiry) return 'expired';
  }
  return 'active';
}

/**
 * Hook to fetch all reels
 */
export function useReels(options?: Omit<UseQueryOptions<UserReel[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: reelKeys.list(),
    queryFn: () => reelsApi.getReels(),
    ...options,
  });
}

/**
 * Hook to fetch active reels
 */
export function useActiveReels(options?: Omit<UseQueryOptions<UserReel[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: reelKeys.active(),
    queryFn: () => reelsApi.getActiveReels(),
    ...options,
  });
}

/**
 * Hook to fetch reels by user ID
 */
export function useUserReels(
  userId: string,
  options?: Omit<UseQueryOptions<UserReel[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: reelKeys.user(userId),
    queryFn: () => reelsApi.getReelsByUser(userId),
    enabled: !!userId,
    ...options,
  });
}

/**
 * Hook to fetch a single reel by ID
 */
export function useReel(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: reelKeys.detail(id),
    queryFn: () => reelsApi.getReel(id),
    enabled: enabled ?? !!id,
  });
}

/**
 * Hook to create a new reel
 */
export function useCreateReel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReelDto) => reelsApi.createReel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reelKeys.active() });
    },
  });
}

/**
 * Hook to update a reel
 */
export function useUpdateReel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateReelDto }) =>
      reelsApi.updateReel(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: reelKeys.details() });
      queryClient.invalidateQueries({ queryKey: reelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reelKeys.active() });
    },
  });
}

/**
 * Hook to delete a reel
 */
export function useDeleteReel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reelsApi.deleteReel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: reelKeys.active() });
    },
  });
}

/**
 * Hook to increment reel views
 */
export function useIncrementReelViews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => reelsApi.incrementReelViews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reelKeys.details() });
      queryClient.invalidateQueries({ queryKey: reelKeys.lists() });
    },
  });
}

export { getReelStatus };
