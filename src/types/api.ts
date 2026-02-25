/**
 * TypeScript types for API requests and responses
 * These should match your backend API structure
 */

// ==================== AUTH TYPES ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

// ==================== USER TYPES ====================

export type UserRole = 'ADMIN' | 'USER' | 'MODERATOR';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// ==================== QUESTION TYPES ====================

export interface Question {
  id: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  points: number;
  categoryId?: string;
  category?: Category;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionRequest {
  text: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  points: number;
  categoryId?: string;
  tags?: string[];
}

export interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {
  id: string;
}

// ==================== CATEGORY TYPES ====================

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}

// ==================== QUIZ TYPES ====================

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  categoryId?: string;
  category?: Category;
  questions: Question[];
  duration?: number; // in minutes
  passingScore?: number; // percentage
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizRequest {
  title: string;
  description?: string;
  categoryId?: string;
  questionIds: string[];
  duration?: number;
  passingScore?: number;
}

// ==================== ATTEMPT TYPES ====================

export interface QuizAttempt {
  id: string;
  quizId: string;
  quiz?: Quiz;
  userId: string;
  user?: User;
  score: number;
  totalScore: number;
  percentage: number;
  passed: boolean;
  startedAt: string;
  completedAt?: string;
  answers: Answer[];
}

export interface Answer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
}

export interface SubmitQuizRequest {
  quizId: string;
  answers: Array<{
    questionId: string;
    answer: string;
  }>;
}

// ==================== ANALYTICS TYPES ====================

export interface DashboardStats {
  totalUsers: number;
  totalQuestions: number;
  totalCategories: number;
  totalQuizzes: number;
  activeUsers: number;
  completedQuizzes: number;
  averageScore: number;
  passRate: number;
}

export interface UserStats {
  totalAttempts: number;
  completedQuizzes: number;
  averageScore: number;
  bestScore: number;
  recentActivity: QuizAttempt[];
}

// ==================== API ERROR TYPES ====================

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  details?: Record<string, string[]>;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ==================== PAGINATION TYPES ====================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ==================== FILTER TYPES ====================

export interface QuestionFilters extends PaginationParams {
  categoryId?: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  type?: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  search?: string;
}

export interface UserFilters extends PaginationParams {
  role?: UserRole;
  search?: string;
}
