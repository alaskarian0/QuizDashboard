/**
 * Library API service
 * CRUD operations for library content: Articles, Lessons, Podcasts, E-Books
 */

import { apiClient } from './client';
import type {
  Article,
  CreateArticleDto,
  UpdateArticleDto,
  ArticleFilters,
  ArticleListResponse,
  Lesson,
  CreateLessonDto,
  UpdateLessonDto,
  LessonFilters,
  LessonListResponse,
  Podcast,
  CreatePodcastDto,
  UpdatePodcastDto,
  PodcastFilters,
  PodcastListResponse,
  EBook,
  CreateEBookDto,
  UpdateEBookDto,
  EBookFilters,
  EBookListResponse,
  LibraryStats,
} from '../types/library';

// ==================== HELPERS ====================

/**
 * Build query string from filters object
 */
function buildQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params || Object.keys(params).length === 0) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString() ? `?${searchParams.toString()}` : '';
}

// ==================== ARTICLES ====================

/**
 * Get all articles with optional filters
 */
export const getArticles = async (filters?: ArticleFilters): Promise<ArticleListResponse> => {
  return apiClient.get<ArticleListResponse>(`/library/articles${buildQueryString(filters as any)}`);
};

/**
 * Get a single article by ID
 */
export const getArticle = async (id: string): Promise<Article> => {
  return apiClient.get<Article>(`/library/articles/${id}`);
};

/**
 * Create a new article
 */
export const createArticle = async (data: CreateArticleDto): Promise<Article> => {
  return apiClient.post<Article>('/library/articles', data);
};

/**
 * Update an existing article
 */
export const updateArticle = async (id: string, data: UpdateArticleDto): Promise<Article> => {
  return apiClient.patch<Article>(`/library/articles/${id}`, data);
};

/**
 * Delete an article
 */
export const deleteArticle = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/library/articles/${id}`);
};

/**
 * Increment article likes
 */
export const likeArticle = async (id: string): Promise<Article> => {
  return apiClient.get<Article>(`/library/articles/${id}/like`);
};

/**
 * Increment article views
 */
export const viewArticle = async (id: string): Promise<Article> => {
  return apiClient.get<Article>(`/library/articles/${id}/view`);
};

// ==================== LESSONS ====================

/**
 * Get all lessons with optional filters
 */
export const getLessons = async (filters?: LessonFilters): Promise<LessonListResponse> => {
  return apiClient.get<LessonListResponse>(`/library/lessons${buildQueryString(filters as any)}`);
};

/**
 * Get a single lesson by ID
 */
export const getLesson = async (id: string): Promise<Lesson> => {
  return apiClient.get<Lesson>(`/library/lessons/${id}`);
};

/**
 * Create a new lesson
 */
export const createLesson = async (data: CreateLessonDto): Promise<Lesson> => {
  return apiClient.post<Lesson>('/library/lessons', data);
};

/**
 * Update an existing lesson
 */
export const updateLesson = async (id: string, data: UpdateLessonDto): Promise<Lesson> => {
  return apiClient.patch<Lesson>(`/library/lessons/${id}`, data);
};

/**
 * Delete a lesson
 */
export const deleteLesson = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/library/lessons/${id}`);
};

// ==================== PODCASTS ====================

/**
 * Get all podcasts with optional filters
 */
export const getPodcasts = async (filters?: PodcastFilters): Promise<PodcastListResponse> => {
  return apiClient.get<PodcastListResponse>(`/library/podcasts${buildQueryString(filters as any)}`);
};

/**
 * Get a single podcast by ID
 */
export const getPodcast = async (id: string): Promise<Podcast> => {
  return apiClient.get<Podcast>(`/library/podcasts/${id}`);
};

/**
 * Create a new podcast
 */
export const createPodcast = async (data: CreatePodcastDto): Promise<Podcast> => {
  return apiClient.post<Podcast>('/library/podcasts', data);
};

/**
 * Update an existing podcast
 */
export const updatePodcast = async (id: string, data: UpdatePodcastDto): Promise<Podcast> => {
  return apiClient.patch<Podcast>(`/library/podcasts/${id}`, data);
};

/**
 * Delete a podcast
 */
export const deletePodcast = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/library/podcasts/${id}`);
};

// ==================== E-BOOKS ====================

/**
 * Get all E-Books with optional filters
 */
export const getEBooks = async (filters?: EBookFilters): Promise<EBookListResponse> => {
  return apiClient.get<EBookListResponse>(`/library/ebooks${buildQueryString(filters as any)}`);
};

/**
 * Get a single E-Book by ID
 */
export const getEBook = async (id: string): Promise<EBook> => {
  return apiClient.get<EBook>(`/library/ebooks/${id}`);
};

/**
 * Create a new E-Book
 */
export const createEBook = async (data: CreateEBookDto): Promise<EBook> => {
  return apiClient.post<EBook>('/library/ebooks', data);
};

/**
 * Update an existing E-Book
 */
export const updateEBook = async (id: string, data: UpdateEBookDto): Promise<EBook> => {
  return apiClient.patch<EBook>(`/library/ebooks/${id}`, data);
};

/**
 * Delete an E-Book
 */
export const deleteEBook = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/library/ebooks/${id}`);
};

// ==================== STATS ====================

/**
 * Get library statistics
 */
export const getLibraryStats = async (): Promise<LibraryStats> => {
  return apiClient.get<LibraryStats>('/library/stats');
};
