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
  const response = await apiClient.get<ArticleListResponse>(`/library/articles${buildQueryString(filters as any)}`);
  return response.data;
};

/**
 * Get a single article by ID
 */
export const getArticle = async (id: string): Promise<Article> => {
  const response = await apiClient.get<Article>(`/library/articles/${id}`);
  return response.data;
};

/**
 * Create a new article
 */
export const createArticle = async (data: CreateArticleDto): Promise<Article> => {
  const response = await apiClient.post<Article>('/library/articles', data);
  return response.data;
};

/**
 * Update an existing article
 */
export const updateArticle = async (id: string, data: UpdateArticleDto): Promise<Article> => {
  const response = await apiClient.patch<Article>(`/library/articles/${id}`, data);
  return response.data;
};

/**
 * Delete an article
 */
export const deleteArticle = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/library/articles/${id}`);
};

/**
 * Increment article likes
 */
export const likeArticle = async (id: string): Promise<Article> => {
  const response = await apiClient.get<Article>(`/library/articles/${id}/like`);
  return response.data;
};

/**
 * Increment article views
 */
export const viewArticle = async (id: string): Promise<Article> => {
  const response = await apiClient.get<Article>(`/library/articles/${id}/view`);
  return response.data;
};

// ==================== LESSONS ====================

/**
 * Get all lessons with optional filters
 */
export const getLessons = async (filters?: LessonFilters): Promise<LessonListResponse> => {
  const response = await apiClient.get<LessonListResponse>(`/library/lessons${buildQueryString(filters as any)}`);
  return response.data;
};

/**
 * Get a single lesson by ID
 */
export const getLesson = async (id: string): Promise<Lesson> => {
  const response = await apiClient.get<Lesson>(`/library/lessons/${id}`);
  return response.data;
};

/**
 * Create a new lesson
 */
export const createLesson = async (data: CreateLessonDto): Promise<Lesson> => {
  const response = await apiClient.post<Lesson>('/library/lessons', data);
  return response.data;
};

/**
 * Update an existing lesson
 */
export const updateLesson = async (id: string, data: UpdateLessonDto): Promise<Lesson> => {
  const response = await apiClient.patch<Lesson>(`/library/lessons/${id}`, data);
  return response.data;
};

/**
 * Delete a lesson
 */
export const deleteLesson = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/library/lessons/${id}`);
};

// ==================== PODCASTS ====================

/**
 * Get all podcasts with optional filters
 */
export const getPodcasts = async (filters?: PodcastFilters): Promise<PodcastListResponse> => {
  const response = await apiClient.get<PodcastListResponse>(`/library/podcasts${buildQueryString(filters as any)}`);
  return response.data;
};

/**
 * Get a single podcast by ID
 */
export const getPodcast = async (id: string): Promise<Podcast> => {
  const response = await apiClient.get<Podcast>(`/library/podcasts/${id}`);
  return response.data;
};

/**
 * Create a new podcast
 */
export const createPodcast = async (data: CreatePodcastDto): Promise<Podcast> => {
  const response = await apiClient.post<Podcast>('/library/podcasts', data);
  return response.data;
};

/**
 * Update an existing podcast
 */
export const updatePodcast = async (id: string, data: UpdatePodcastDto): Promise<Podcast> => {
  const response = await apiClient.patch<Podcast>(`/library/podcasts/${id}`, data);
  return response.data;
};

/**
 * Delete a podcast
 */
export const deletePodcast = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/library/podcasts/${id}`);
};

// ==================== E-BOOKS ====================

/**
 * Get all E-Books with optional filters
 */
export const getEBooks = async (filters?: EBookFilters): Promise<EBookListResponse> => {
  const response = await apiClient.get<EBookListResponse>(`/library/ebooks${buildQueryString(filters as any)}`);
  return response.data;
};

/**
 * Get a single E-Book by ID
 */
export const getEBook = async (id: string): Promise<EBook> => {
  const response = await apiClient.get<EBook>(`/library/ebooks/${id}`);
  return response.data;
};

/**
 * Create a new E-Book
 */
export const createEBook = async (data: CreateEBookDto): Promise<EBook> => {
  const response = await apiClient.post<EBook>('/library/ebooks', data);
  return response.data;
};

/**
 * Update an existing E-Book
 */
export const updateEBook = async (id: string, data: UpdateEBookDto): Promise<EBook> => {
  const response = await apiClient.patch<EBook>(`/library/ebooks/${id}`, data);
  return response.data;
};

/**
 * Delete an E-Book
 */
export const deleteEBook = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/library/ebooks/${id}`);
};

// ==================== STATS ====================

/**
 * Get library statistics
 */
export const getLibraryStats = async (): Promise<LibraryStats> => {
  const response = await apiClient.get<LibraryStats>('/library/stats');
  return response.data;
};
