import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';
import { AxiosError } from 'axios';
import { logout } from '../api/auth';

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
            gcTime: 1000 * 60 * 10, // 10 minutes (previously cacheTime)
            retry: (failureCount, error) => {
              // Don't retry on 401 (unauthorized) or 403 (forbidden) errors
              if (error instanceof AxiosError) {
                const status = error.response?.status;
                if (status === 401 || status === 403) {
                  return false;
                }
              }
              // Retry up to 3 times for other errors
              return failureCount < 3;
            },
            refetchOnWindowFocus: false,
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
              // Retry up to 2 times for other errors
              return failureCount < 2;
            },
          },
        },
      })
  );

  // Global error handling for queries
  queryClient.setMutationDefaults(['login'], {
    mutationFn: async () => {
      // Default mutation function - will be overridden by useMutation
      return {};
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
    },
  });

  // Handle query errors globally
  queryClient.setQueryDefaults(['user'], {
    onError: (error: Error) => {
      if (error.message.includes('401') || error.message.includes('403')) {
        logout();
      }
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
