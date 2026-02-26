/**
 * React Query hooks for Contests API
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import * as contestsApi from '../api/contests';
import type {
  Contest,
  CreateContestDto,
  UpdateContestDto,
  SubmitContestDto,
  ContestResult,
  ContestStatus,
  ContestWithStatus,
} from '../types/contests';

// Query keys
export const contestKeys = {
  all: ['contests'] as const,
  lists: () => [...contestKeys.all, 'list'] as const,
  list: () => [...contestKeys.lists()] as const,
  monthly: () => [...contestKeys.all, 'monthly'] as const,
  active: () => [...contestKeys.all, 'active'] as const,
  details: () => [...contestKeys.all, 'detail'] as const,
  detail: (id: string) => [...contestKeys.details(), id] as const,
};

/**
 * Helper function to determine contest status
 */
function getContestStatus(contest: Contest): ContestStatus {
  const now = new Date();
  const start = new Date(contest.startTime);
  const end = new Date(contest.endTime);

  if (now < start) return 'upcoming';
  if (now > end) return 'ended';
  return 'active';
}

/**
 * Helper to add status to contests
 */
function addContestStatus(contests: Contest[]): ContestWithStatus[] {
  const now = new Date();
  return contests.map(contest => {
    const status = getContestStatus(contest);
    const start = new Date(contest.startTime);
    const end = new Date(contest.endTime);

    const result: ContestWithStatus = {
      ...contest,
      status,
    };

    if (status === 'active') {
      result.timeRemaining = Math.floor((end.getTime() - now.getTime()) / 1000);
    } else if (status === 'upcoming') {
      result.timeUntilStart = Math.floor((start.getTime() - now.getTime()) / 1000);
    }

    return result;
  });
}

/**
 * Hook to fetch all contests
 */
export function useContests(options?: Omit<UseQueryOptions<Contest[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: contestKeys.list(),
    queryFn: () => contestsApi.getContests(),
    ...options,
  });
}

/**
 * Hook to fetch all contests with status
 */
export function useContestsWithStatus(options?: Omit<UseQueryOptions<ContestWithStatus[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: contestKeys.list(),
    queryFn: async () => {
      const contests = await contestsApi.getContests();
      return addContestStatus(contests);
    },
    ...options,
  });
}

/**
 * Hook to fetch monthly contests
 */
export function useMonthlyContests(options?: Omit<UseQueryOptions<Contest[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: contestKeys.monthly(),
    queryFn: () => contestsApi.getMonthlyContests(),
    ...options,
  });
}

/**
 * Hook to fetch active contests
 */
export function useActiveContests(options?: Omit<UseQueryOptions<Contest[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: contestKeys.active(),
    queryFn: () => contestsApi.getActiveContests(),
    ...options,
  });
}

/**
 * Hook to fetch a single contest by ID
 */
export function useContest(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: contestKeys.detail(id),
    queryFn: () => contestsApi.getContest(id),
    enabled: enabled ?? !!id,
  });
}

/**
 * Hook to create a new contest
 */
export function useCreateContest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContestDto) => contestsApi.createContest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contestKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contestKeys.monthly() });
      queryClient.invalidateQueries({ queryKey: contestKeys.active() });
    },
  });
}

/**
 * Hook to update a contest
 */
export function useUpdateContest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContestDto }) =>
      contestsApi.updateContest(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contestKeys.details() });
      queryClient.invalidateQueries({ queryKey: contestKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contestKeys.monthly() });
      queryClient.invalidateQueries({ queryKey: contestKeys.active() });
    },
  });
}

/**
 * Hook to delete a contest
 */
export function useDeleteContest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contestsApi.deleteContest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contestKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contestKeys.monthly() });
      queryClient.invalidateQueries({ queryKey: contestKeys.active() });
    },
  });
}

/**
 * Hook to submit contest answers
 */
export function useSubmitContest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitContestDto) => contestsApi.submitContest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contestKeys.active() });
    },
  });
}
