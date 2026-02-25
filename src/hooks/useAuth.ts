import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { login as apiLogin, logout as apiLogout, getMe, getStoredUser, isAuthenticated as checkAuth } from '../api/auth';
import type { User } from '../types/auth';

export function useAuth() {
  const queryClient = useQueryClient();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      apiLogin(username, password),
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.setQueryData(['user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: Error) => {
      console.error('Login failed:', error);
    },
  });

  // Get user query - check auth status once and store it
  const hasToken = useMemo(() => checkAuth(), []);

  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = checkAuth();
      if (!token) {
        return null;
      }
      try {
        return await getMe();
      } catch (error) {
        // If we can't fetch user from server, try to get from localStorage
        const storedUser = getStoredUser();
        if (storedUser) {
          return storedUser;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    enabled: hasToken, // Only run query if user has a token
  });

  // Logout function
  const logout = useCallback(() => {
    apiLogout();
    queryClient.setQueryData(['user'], null);
    queryClient.clear();
  }, [queryClient]);

  // Login function
  const login = useCallback(
    async (username: string, password: string) => {
      await loginMutation.mutateAsync({ username, password });
    },
    [loginMutation]
  );

  // Computed values - derive from user data instead of checking localStorage repeatedly
  const isAuthenticated = !!user;
  const isLoading = isLoadingUser || loginMutation.isPending;

  return {
    user: user || null,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refetchUser,
    error: loginMutation.error || userError,
    isLoginLoading: loginMutation.isPending,
  };
}
