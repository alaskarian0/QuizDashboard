// React Query Provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect, type ReactNode } from 'react';
import { getAccessToken, logout, refreshToken } from '../api/auth';
import { AxiosError } from 'axios';
import apiClient from '../api/client';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // Don't retry on 401 (unauthorized) or 403 (forbidden) errors
              if (error instanceof AxiosError) {
                const status = error.response?.status;
                if (status === 401 || status === 403) {
                  return false;
                }
              }
              return failureCount < 1;
            },
          },
          mutations: {
            retry: (failureCount, error) => {
              // Don't retry on 401 (unauthorized) or 403 (forbidden) errors
              if (error instanceof AxiosError) {
                const status = error.response?.status;
                if (status === 401 || status === 403) {
                  return false;
                }
              }
              return failureCount < 1;
            },
          },
        },
      })
  );

  // Set up global error handlers
  useEffect(() => {
    // Handle query cache errors
    const handleError = (error: Error) => {
      console.error('Query error:', error);
    };

    // Subscribe to query cache errors - using proper callback syntax
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'error') {
        handleError(event.error);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
