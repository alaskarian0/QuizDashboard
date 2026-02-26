/**
 * React Query hooks for Review System
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import * as reviewApi from '../api/review';
import type {
  AnswerHistory,
  AnswerStats,
  QuestionHistoryStats,
  WrongAnswerReview,
  RecordAnswerDto,
} from '../types/reels';

// Query keys
export const reviewKeys = {
  all: ['review'] as const,
  history: () => [...reviewKeys.all, 'history'] as const,
  stats: () => [...reviewKeys.all, 'stats'] as const,
  question: (id: string) => [...reviewKeys.all, 'question', id] as const,
  incorrect: () => [...reviewKeys.all, 'incorrect'] as const,
  reviewQueue: () => [...reviewKeys.all, 'reviewQueue'] as const,
};

/**
 * Hook to get user's answer history
 */
export function useAnswerHistory(options?: Omit<UseQueryOptions<AnswerHistory[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: reviewKeys.history(),
    queryFn: () => reviewApi.getMyAnswerHistory(),
    ...options,
  });
}

/**
 * Hook to get user's answer statistics
 */
export function useAnswerStats(options?: Omit<UseQueryOptions<AnswerStats, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: reviewKeys.stats(),
    queryFn: () => reviewApi.getMyAnswerStats(),
    ...options,
  });
}

/**
 * Hook to get history for a specific question
 */
export function useQuestionHistory(
  questionId: string,
  options?: Omit<UseQueryOptions<QuestionHistoryStats, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: reviewKeys.question(questionId),
    queryFn: () => reviewApi.getQuestionHistory(questionId),
    enabled: !!questionId,
    ...options,
  });
}

/**
 * Hook to get incorrect answers (wrong answers that need review)
 */
export function useIncorrectAnswers(options?: Omit<UseQueryOptions<AnswerHistory[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: reviewKeys.incorrect(),
    queryFn: () => reviewApi.getIncorrectAnswers(),
    ...options,
  });
}

/**
 * Hook to get wrong answers formatted for review
 */
export function useWrongAnswersForReview(options?: Omit<UseQueryOptions<WrongAnswerReview[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: reviewKeys.reviewQueue(),
    queryFn: () => reviewApi.getWrongAnswersForReview(),
    ...options,
  });
}

/**
 * Hook to record an answer
 */
export function useRecordAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RecordAnswerDto) => reviewApi.recordAnswer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.history() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.stats() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.incorrect() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.reviewQueue() });
    },
  });
}

/**
 * Hook to mark questions as mastered
 */
export function useMarkMastered() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionIds: string[]) => reviewApi.markQuestionsMastered(questionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.incorrect() });
      queryClient.invalidateQueries({ queryKey: reviewKeys.reviewQueue() });
    },
  });
}
