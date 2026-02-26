/**
 * React Query hooks for Library API
 * Hooks for managing Articles, Lessons, Podcasts, and E-Books
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import * as libraryApi from '../api/library';
import type {
  Article,
  CreateArticleDto,
  UpdateArticleDto,
  ArticleFilters,
  Lesson,
  CreateLessonDto,
  UpdateLessonDto,
  LessonFilters,
  Podcast,
  CreatePodcastDto,
  UpdatePodcastDto,
  PodcastFilters,
  EBook,
  CreateEBookDto,
  UpdateEBookDto,
  EBookFilters,
  LibraryStats,
} from '../types/library';

// ==================== QUERY KEYS ====================

export const libraryKeys = {
  all: ['library'] as const,
  articles: {
    all: ['library', 'articles'] as const,
    lists: () => [...libraryKeys.articles.all, 'list'] as const,
    list: (filters?: ArticleFilters) => [...libraryKeys.articles.lists(), filters] as const,
    detail: (id: string) => [...libraryKeys.articles.all, 'detail', id] as const,
  },
  lessons: {
    all: ['library', 'lessons'] as const,
    lists: () => [...libraryKeys.lessons.all, 'list'] as const,
    list: (filters?: LessonFilters) => [...libraryKeys.lessons.lists(), filters] as const,
    detail: (id: string) => [...libraryKeys.lessons.all, 'detail', id] as const,
  },
  podcasts: {
    all: ['library', 'podcasts'] as const,
    lists: () => [...libraryKeys.podcasts.all, 'list'] as const,
    list: (filters?: PodcastFilters) => [...libraryKeys.podcasts.lists(), filters] as const,
    detail: (id: string) => [...libraryKeys.podcasts.all, 'detail', id] as const,
  },
  ebooks: {
    all: ['library', 'ebooks'] as const,
    lists: () => [...libraryKeys.ebooks.all, 'list'] as const,
    list: (filters?: EBookFilters) => [...libraryKeys.ebooks.lists(), filters] as const,
    detail: (id: string) => [...libraryKeys.ebooks.all, 'detail', id] as const,
  },
  stats: () => ['library', 'stats'] as const,
};

// ==================== ARTICLES HOOKS ====================

/**
 * Hook to fetch articles with optional filters
 */
export function useArticles(filters?: ArticleFilters, options?: Omit<UseQueryOptions<Article[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: libraryKeys.articles.list(filters),
    queryFn: async () => {
      const response = await libraryApi.getArticles(filters);
      return response.data;
    },
    ...options,
  });
}

/**
 * Hook to fetch a single article by ID
 */
export function useArticle(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: libraryKeys.articles.detail(id),
    queryFn: () => libraryApi.getArticle(id),
    enabled: enabled ?? !!id,
  });
}

/**
 * Hook to create a new article
 */
export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateArticleDto) => libraryApi.createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.articles.lists() });
    },
  });
}

/**
 * Hook to update an article
 */
export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleDto }) =>
      libraryApi.updateArticle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.articles.lists() });
      queryClient.invalidateQueries({ queryKey: libraryKeys.articles.detail(variables.id) });
    },
  });
}

/**
 * Hook to delete an article
 */
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => libraryApi.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.articles.lists() });
    },
  });
}

/**
 * Hook to like an article
 */
export function useLikeArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => libraryApi.likeArticle(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.articles.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: libraryKeys.articles.lists() });
    },
  });
}

// ==================== LESSONS HOOKS ====================

/**
 * Hook to fetch lessons with optional filters
 */
export function useLessons(filters?: LessonFilters, options?: Omit<UseQueryOptions<Lesson[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: libraryKeys.lessons.list(filters),
    queryFn: async () => {
      const response = await libraryApi.getLessons(filters);
      return response.data;
    },
    ...options,
  });
}

/**
 * Hook to fetch a single lesson by ID
 */
export function useLesson(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: libraryKeys.lessons.detail(id),
    queryFn: () => libraryApi.getLesson(id),
    enabled: enabled ?? !!id,
  });
}

/**
 * Hook to create a new lesson
 */
export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLessonDto) => libraryApi.createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.lessons.lists() });
    },
  });
}

/**
 * Hook to update a lesson
 */
export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLessonDto }) =>
      libraryApi.updateLesson(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.lessons.lists() });
      queryClient.invalidateQueries({ queryKey: libraryKeys.lessons.detail(variables.id) });
    },
  });
}

/**
 * Hook to delete a lesson
 */
export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => libraryApi.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.lessons.lists() });
    },
  });
}

// ==================== PODCASTS HOOKS ====================

/**
 * Hook to fetch podcasts with optional filters
 */
export function usePodcasts(filters?: PodcastFilters, options?: Omit<UseQueryOptions<Podcast[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: libraryKeys.podcasts.list(filters),
    queryFn: async () => {
      const response = await libraryApi.getPodcasts(filters);
      return response.data;
    },
    ...options,
  });
}

/**
 * Hook to fetch a single podcast by ID
 */
export function usePodcast(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: libraryKeys.podcasts.detail(id),
    queryFn: () => libraryApi.getPodcast(id),
    enabled: enabled ?? !!id,
  });
}

/**
 * Hook to create a new podcast
 */
export function useCreatePodcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePodcastDto) => libraryApi.createPodcast(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.podcasts.lists() });
    },
  });
}

/**
 * Hook to update a podcast
 */
export function useUpdatePodcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePodcastDto }) =>
      libraryApi.updatePodcast(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.podcasts.lists() });
      queryClient.invalidateQueries({ queryKey: libraryKeys.podcasts.detail(variables.id) });
    },
  });
}

/**
 * Hook to delete a podcast
 */
export function useDeletePodcast() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => libraryApi.deletePodcast(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.podcasts.lists() });
    },
  });
}

// ==================== E-BOOKS HOOKS ====================

/**
 * Hook to fetch E-Books with optional filters
 */
export function useEBooks(filters?: EBookFilters, options?: Omit<UseQueryOptions<EBook[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: libraryKeys.ebooks.list(filters),
    queryFn: async () => {
      const response = await libraryApi.getEBooks(filters);
      return response.data;
    },
    ...options,
  });
}

/**
 * Hook to fetch a single E-Book by ID
 */
export function useEBook(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: libraryKeys.ebooks.detail(id),
    queryFn: () => libraryApi.getEBook(id),
    enabled: enabled ?? !!id,
  });
}

/**
 * Hook to create a new E-Book
 */
export function useCreateEBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEBookDto) => libraryApi.createEBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.ebooks.lists() });
    },
  });
}

/**
 * Hook to update an E-Book
 */
export function useUpdateEBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEBookDto }) =>
      libraryApi.updateEBook(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.ebooks.lists() });
      queryClient.invalidateQueries({ queryKey: libraryKeys.ebooks.detail(variables.id) });
    },
  });
}

/**
 * Hook to delete an E-Book
 */
export function useDeleteEBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => libraryApi.deleteEBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.ebooks.lists() });
    },
  });
}

// ==================== STATS HOOK ====================

/**
 * Hook to fetch library statistics
 */
export function useLibraryStats(options?: Omit<UseQueryOptions<LibraryStats, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: libraryKeys.stats(),
    queryFn: () => libraryApi.getLibraryStats(),
    ...options,
  });
}
