// React Query Hooks for Questions
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { questionsApi } from '../api/questions';
import type {
  Question,
  CreateQuestionDto,
  UpdateQuestionDto,
  QueryQuestionsDto,
  QuestionStats,
  QuestionCategory,
} from '../types/questions';

// Query keys
export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  list: (filters?: QueryQuestionsDto) => [...questionKeys.lists(), filters] as const,
  details: () => [...questionKeys.all, 'detail'] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,
  stats: () => [...questionKeys.all, 'stats'] as const,
  categories: () => [...questionKeys.all, 'categories'] as const,
  export: () => [...questionKeys.all, 'export'] as const,
  daily: () => [...questionKeys.all, 'daily'] as const,
};

/**
 * Hook to fetch questions with optional filters
 */
export function useQuestions(filters?: QueryQuestionsDto, options?: Omit<UseQueryOptions<Question[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: questionKeys.list(filters),
    queryFn: () => questionsApi.getQuestions(filters),
    ...options,
  });
}

/**
 * Hook to fetch a single question by ID
 */
export function useQuestion(id: string, enabled?: boolean) {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => questionsApi.getQuestion(id),
    enabled: enabled ?? !!id,
  });
}

/**
 * Hook to create a question
 */
export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionDto) => questionsApi.createQuestion(data),
    onSuccess: () => {
      // Invalidate and refetch questions list
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: questionKeys.stats() });
      queryClient.invalidateQueries({ queryKey: questionKeys.categories() });
    },
  });
}

/**
 * Hook to update a question
 */
export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateQuestionDto }) =>
      questionsApi.updateQuestion(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific question and list
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: questionKeys.stats() });
    },
  });
}

/**
 * Hook to delete a question
 */
export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => questionsApi.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: questionKeys.stats() });
      queryClient.invalidateQueries({ queryKey: questionKeys.categories() });
    },
  });
}

/**
 * Hook to bulk delete questions
 */
export function useBulkDeleteQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => questionsApi.bulkDelete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: questionKeys.stats() });
      queryClient.invalidateQueries({ queryKey: questionKeys.categories() });
    },
  });
}

/**
 * Hook to fetch question statistics
 */
export function useQuestionStats(options?: Omit<UseQueryOptions<QuestionStats, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: questionKeys.stats(),
    queryFn: () => questionsApi.getQuestionStats(),
    ...options,
  });
}

/**
 * Hook to fetch question categories
 */
export function useQuestionCategories(options?: Omit<UseQueryOptions<QuestionCategory[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: questionKeys.categories(),
    queryFn: () => questionsApi.getQuestionCategories(),
    ...options,
  });
}

/**
 * Hook to export questions
 */
export function useExportQuestions() {
  return useQuery({
    queryKey: questionKeys.export(),
    queryFn: () => questionsApi.exportQuestions(),
    enabled: false, // Only run when manually triggered
  });
}

/**
 * Hook to fetch daily challenge questions
 */
export function useDailyChallenge(options?: Omit<UseQueryOptions<Question[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: questionKeys.daily(),
    queryFn: () => questionsApi.getDailyChallenge(),
    ...options,
  });
}
