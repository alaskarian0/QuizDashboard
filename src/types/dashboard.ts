/**
 * Dashboard statistics from the analytics API
 */
export interface DashboardStats {
  totalQuestions: number;
  totalUsers: number;
  totalCategories: number;
  questionsAddedThisMonth: number;
  newUsersThisWeek: number;
  averageAccuracy: number;
  completionRate: number;
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
