/**
 * Review System API client
 * Handles wrong answers review and learning
 */

import { apiClient } from './client';
import type {
  AnswerHistory,
  AnswerStats,
  QuestionHistoryStats,
  WrongAnswerReview,
  RecordAnswerDto,
} from '../types/reels';
import type { Question } from '../types/questions';

/**
 * Get user's answer history
 */
export const getMyAnswerHistory = async (): Promise<AnswerHistory[]> => {
  return apiClient.get<AnswerHistory[]>('/answer-history');
};

/**
 * Get user's answer statistics
 */
export const getMyAnswerStats = async (): Promise<AnswerStats> => {
  return apiClient.get<AnswerStats>('/answer-history/stats');
};

/**
 * Get question history by question ID
 */
export const getQuestionHistory = async (questionId: string): Promise<QuestionHistoryStats> => {
  return apiClient.get<QuestionHistoryStats>(`/answer-history/question/${questionId}`);
};

/**
 * Get incorrect answers for review
 */
export const getIncorrectAnswers = async (): Promise<AnswerHistory[]> => {
  return apiClient.get<AnswerHistory[]>('/answer-history/incorrect');
};

/**
 * Get unique wrong answers that need review
 * This filters out duplicate questions and returns only those needing review
 */
export const getWrongAnswersForReview = async (): Promise<WrongAnswerReview[]> => {
  const incorrect = await getIncorrectAnswers();

  // Group by question ID and get the most recent wrong answer for each
  const questionMap = new Map<string, AnswerHistory>();

  for (const answer of incorrect) {
    const existing = questionMap.get(answer.questionId);
    if (!existing || new Date(answer.createdAt) > new Date(existing.createdAt)) {
      questionMap.set(answer.questionId, answer);
    }
  }

  // Transform to WrongAnswerReview format
  return Array.from(questionMap.values()).map((item) => {
    const question = item.question;
    return {
      ...item,
      correctOption: question?.correctOption ?? 0,
      userWrongAnswer: item.answer,
      needsReview: true,
      reviewAttempts: 0,
    };
  });
};

/**
 * Record an answer for a question
 */
export const recordAnswer = async (data: RecordAnswerDto): Promise<AnswerHistory> => {
  return apiClient.post<AnswerHistory>('/answer-history/record', data);
};

/**
 * Get questions by category for review session
 */
export const getReviewQuestions = async (categoryIds?: string[]): Promise<Question[]> => {
  let url = '/questions';
  if (categoryIds && categoryIds.length > 0) {
    url += `?categoryIds=${categoryIds.join(',')}`;
  }
  return apiClient.get<Question[]>(url);
};

/**
 * Mark questions as mastered (after correct review)
 */
export const markQuestionsMastered = async (questionIds: string[]): Promise<void> => {
  // This endpoint might need to be created in the backend
  return apiClient.post<void>('/answer-history/mark-mastered', { questionIds });
};
