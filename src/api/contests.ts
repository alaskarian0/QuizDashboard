/**
 * Contests API service
 * CRUD operations for contests
 */

import { apiClient } from './client';
import type {
  Contest,
  CreateContestDto,
  UpdateContestDto,
  SubmitContestDto,
  ContestResult,
} from '../types/contests';

/**
 * Get all contests
 */
export const getContests = async (): Promise<Contest[]> => {
  return apiClient.get<Contest[]>('/contest');
};

/**
 * Get monthly contests
 */
export const getMonthlyContests = async (): Promise<Contest[]> => {
  return apiClient.get<Contest[]>('/contest/monthly');
};

/**
 * Get active contests
 */
export const getActiveContests = async (): Promise<Contest[]> => {
  return apiClient.get<Contest[]>('/contest/active');
};

/**
 * Get a single contest by ID
 */
export const getContest = async (id: string): Promise<Contest> => {
  return apiClient.get<Contest>(`/contest/${id}`);
};

/**
 * Create a new contest
 */
export const createContest = async (data: CreateContestDto): Promise<Contest> => {
  return apiClient.post<Contest>('/contest', data);
};

/**
 * Update an existing contest
 */
export const updateContest = async (id: string, data: UpdateContestDto): Promise<Contest> => {
  return apiClient.patch<Contest>(`/contest/${id}`, data);
};

/**
 * Delete a contest
 */
export const deleteContest = async (id: string): Promise<void> => {
  return apiClient.delete<void>(`/contest/${id}`);
};

/**
 * Submit contest answers
 */
export const submitContest = async (data: SubmitContestDto): Promise<ContestResult> => {
  return apiClient.post<ContestResult>('/contest/submit', data);
};
