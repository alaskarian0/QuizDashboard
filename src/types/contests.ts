/**
 * Contest type definitions
 */

/**
 * Contest entity
 */
export interface Contest {
  id: string;
  title: string;
  description?: string;
  startTime: Date | string;
  endTime: Date | string;
  questions: string; // JSON string array of question IDs
  rewardXP: number;
}

/**
 * Contest status based on current time
 */
export type ContestStatus = 'upcoming' | 'active' | 'ended';

/**
 * Create contest DTO
 */
export interface CreateContestDto {
  title: string;
  description?: string;
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
  questions: string[]; // Array of question IDs
  rewardXP?: number;
}

/**
 * Update contest DTO
 */
export interface UpdateContestDto {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  questions?: string[];
  rewardXP?: number;
}

/**
 * Contest submission
 */
export interface SubmitContestDto {
  contestId: string;
  answers: Record<string, number>; // questionId -> answerIndex
}

/**
 * Contest result
 */
export interface ContestResult {
  userId: string;
  contestId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  submittedAt: Date | string;
}

/**
 * Contest with status
 */
export interface ContestWithStatus extends Contest {
  status: ContestStatus;
  timeRemaining?: number; // in seconds for active contests
  timeUntilStart?: number; // in seconds for upcoming contests
}
