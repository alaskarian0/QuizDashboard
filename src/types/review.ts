/**
 * Review System types for wrong answers
 */

import type { Question } from './questions';

/**
 * Answer history entry
 */
export interface AnswerHistory {
  id: string;
  userId: string;
  questionId: string;
  answer: number;
  isCorrect: boolean;
  xpEarned: number;
  createdAt: Date | string;
  question?: Question & {
    category?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

/**
 * Wrong answer item for review
 */
export interface WrongAnswerReview extends AnswerHistory {
  correctOption: number;
  userWrongAnswer: number;
  needsReview: boolean;
  reviewAttempts: number;
  lastReviewedAt?: Date | string;
  masteredAt?: Date | string;
}

/**
 * User answer statistics
 */
export interface AnswerStats {
  total: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  totalXP: number;
}

/**
 * Question history statistics
 */
export interface QuestionHistoryStats {
  questionId: string;
  attempts: number;
  correctRate: number;
}

/**
 * Review session for learning wrong answers
 */
export interface ReviewSession {
  id: string;
  userId: string;
  startedAt: Date | string;
  completedAt?: Date | string;
  totalQuestions: number;
  correctAnswers: number;
  status: 'in_progress' | 'completed' | 'abandoned';
}

/**
 * Record answer DTO
 */
export interface RecordAnswerDto {
  questionId: string;
  answer: number;
}

/**
 * Review session result
 */
export interface ReviewResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  improvedCount: number;
  masteredQuestions: string[];
  stillNeedsReview: string[];
}
