import { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { SplashScreen } from '../app/components/SplashScreen';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen isDark={false} onComplete={() => {}} />;
  }

  if (!isAuthenticated) {
    // The App component will handle redirecting to login
    return null;
  }

  return <>{children}</>;
}
