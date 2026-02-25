/**
 * Activity item for recent activity feed
 */
export interface ActivityItem {
  title: string;
  category: string;
  time: string;
}

/**
 * Dashboard statistics from the analytics API
 */
export interface DashboardStats {
  totalQuestions: number;
  totalUsers: number;
  totalCategories: number;
  questionsThisMonth?: number;
  usersThisWeek?: number;
  questionsAddedThisMonth?: number;
  newUsersThisWeek?: number;
  averageAccuracy?: number;
  accuracyRate?: number;
  completionRate?: number;
  adminName?: string;
  recentActivity?: ActivityItem[];
}

/**
 * API response wrapper for dashboard statistics
 */
export interface DashboardStatsResponse extends DashboardStats {}

/**
 * Error response from the API
 */
export interface DashboardError {
  message: string;
  statusCode?: number;
  error?: string;
}
