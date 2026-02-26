import { useState, useEffect, memo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SplashScreen } from '@/app/components/SplashScreen';
import { LoginScreen } from '@/app/components/LoginScreen';
import { AdminLayout } from '@/app/components/AdminLayout';
import { DashboardPage } from '@/app/pages/DashboardPage';
import { QuestionsPage } from '@/app/pages/QuestionsPage';
import { CoursesPage } from '@/app/pages/CoursesPage';
import { UsersPage } from '@/app/pages/UsersPage';
import { LibraryPage } from '@/app/pages/LibraryPage';
import { HierarchicalViewPage } from '@/app/pages/HierarchicalViewPage';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from '@/app/components/ui/sonner';

// Protected Route Component
const ProtectedRoute = memo(function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
});

// Public Route Component (redirect if authenticated)
const PublicRoute = memo(function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
});

function AppContent() {
  const [isDark, setIsDark] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  // Hide splash after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen isDark={isDark} onComplete={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginScreen isDark={isDark} onToggleTheme={toggleTheme} />
            </PublicRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout isDark={isDark} onToggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage isDark={isDark} />} />
          <Route path="questions" element={<QuestionsPage isDark={isDark} />} />
          <Route path="courses" element={<CoursesPage isDark={isDark} />} />
          <Route path="users" element={<UsersPage isDark={isDark} />} />
          <Route path="library" element={<LibraryPage isDark={isDark} />} />
          <Route path="hierarchical-view" element={<HierarchicalViewPage isDark={isDark} />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default function App() {
  return <AppContent />;
}
