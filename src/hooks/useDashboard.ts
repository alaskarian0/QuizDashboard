import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/dashboard';
import type { DashboardStats } from '../types/dashboard';

/**
 * Hook return type for useDashboard
 */
interface UseDashboardReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching and managing dashboard statistics
 *
 * This hook fetches dashboard statistics from the API and provides:
 * - Real-time statistics data
 * - Loading state
 * - Error handling with error messages
 * - Refetch capability for manual refresh
 * - Auto-refresh every 30 seconds using React Query
 * - Automatic caching and deduplication
 *
 * @returns UseDashboardReturn object containing stats, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { stats, isLoading, error, refetch } = useDashboard();
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 *
 * return <div>Total Questions: {stats?.totalQuestions}</div>;
 * ```
 */
export const useDashboard = (): UseDashboardReturn => {
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useQuery<DashboardStats, Error>({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
    staleTime: 10000, // Consider data fresh for 10 seconds
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  return {
    stats: stats || null,
    isLoading,
    error,
    refetch,
  };
};
