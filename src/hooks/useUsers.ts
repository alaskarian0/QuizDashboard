/**
 * React Query hooks for Users API
 * Provides hooks for user management operations
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import * as usersApi from '../api/users';
import type {
  User,
  UserFilters,
  UserStats,
  LeaderboardEntry,
  UserRank,
} from '../types/users';

// Query keys factory for cache management
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  stats: (id: string) => [...userKeys.all, 'stats', id] as const,
  leaderboard: (limit?: number, period?: string) =>
    [...userKeys.all, 'leaderboard', limit, period] as const,
  current: () => [...userKeys.all, 'current'] as const,
  currentStats: () => [...userKeys.all, 'current', 'stats'] as const,
  currentRank: () => [...userKeys.all, 'current', 'rank'] as const,
};

/**
 * Hook to fetch all users with optional filters
 */
export function useUsers(
  filters?: UserFilters,
  options?: Omit<UseQueryOptions<User[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<User[], Error>({
    queryKey: userKeys.list(filters),
    queryFn: () => usersApi.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook to fetch a single user by ID
 */
export function useUser(
  id: string,
  options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<User, Error>({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
}

/**
 * Hook to update user status (ban/unban)
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; status: 'ACTIVE' | 'BANNED' }>({
    mutationFn: ({ id, status }) => usersApi.updateUserStatus(id, status),
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData<User[]>(userKeys.lists().queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData<User[]>(userKeys.lists().queryKey, (old = []) =>
        old.map((user) =>
          user.id === id ? { ...user, status } : user
        )
      );

      // Return context with previous value
      return { previousUsers };
    },
    onError: (error, variables, context) => {
      // Rollback to previous value on error
      if (context?.previousUsers) {
        queryClient.setQueryData(userKeys.lists().queryKey, context.previousUsers);
      }
    },
    onSettled: (data, error, variables) => {
      // Refetch to ensure server state
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData<User[]>(userKeys.lists().queryKey);

      // Optimistically remove the user
      queryClient.setQueryData<User[]>(userKeys.lists().queryKey, (old = []) =>
        old.filter((user) => user.id !== id)
      );

      // Return context with previous value
      return { previousUsers };
    },
    onError: (error, id, context) => {
      // Rollback to previous value on error
      if (context?.previousUsers) {
        queryClient.setQueryData(userKeys.lists().queryKey, context.previousUsers);
      }
    },
    onSettled: () => {
      // Refetch to ensure server state
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

/**
 * Hook to fetch user statistics
 */
export function useUserStats(
  id: string,
  options?: Omit<UseQueryOptions<UserStats, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<UserStats, Error>({
    queryKey: userKeys.stats(id),
    queryFn: () => usersApi.getUserStats(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook to fetch leaderboard
 */
export function useLeaderboard(
  limit?: number,
  period?: 'week' | 'month' | 'year',
  options?: Omit<UseQueryOptions<LeaderboardEntry[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<LeaderboardEntry[], Error>({
    queryKey: userKeys.leaderboard(limit, period),
    queryFn: () => usersApi.getLeaderboard(limit, period),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

/**
 * Hook to fetch current user profile
 */
export function useCurrentUser(
  options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<User, Error>({
    queryKey: userKeys.current(),
    queryFn: () => usersApi.getCurrentUserProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    ...options,
  });
}

/**
 * Hook to fetch current user stats
 */
export function useCurrentUserStats(
  options?: Omit<UseQueryOptions<UserStats, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<UserStats, Error>({
    queryKey: userKeys.currentStats(),
    queryFn: () => usersApi.getCurrentUserStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook to fetch current user rank
 */
export function useCurrentUserRank(
  options?: Omit<UseQueryOptions<UserRank, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<UserRank, Error>({
    queryKey: userKeys.currentRank(),
    queryFn: () => usersApi.getCurrentUserRank(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}
