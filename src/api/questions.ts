// Questions API
import { fetchAPI } from '../lib/api';
import type {
  Question,
  CreateQuestionDto,
  UpdateQuestionDto,
  QueryQuestionsDto,
  QuestionStats,
  QuestionCategory,
  BulkDeleteDto,
} from '../types/questions';

export const questionsApi = {
  /**
   * Get all questions with optional filters
   * GET /questions
   */
  async getQuestions(filters?: QueryQuestionsDto): Promise<Question[]> {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    return fetchAPI<Question[]>(`/questions${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get a single question by ID
   * GET /questions/:id
   */
  async getQuestion(id: string): Promise<Question> {
    return fetchAPI<Question>(`/questions/${id}`);
  },

  /**
   * Create a new question
   * POST /questions
   */
  async createQuestion(data: CreateQuestionDto): Promise<Question> {
    return fetchAPI<Question>(`/questions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a question
   * PATCH /questions/:id
   */
  async updateQuestion(id: string, data: UpdateQuestionDto): Promise<Question> {
    return fetchAPI<Question>(`/questions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a question
   * DELETE /questions/:id
   */
  async deleteQuestion(id: string): Promise<{ message: string }> {
    return fetchAPI<{ message: string }>(`/questions/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Bulk delete questions
   * DELETE /questions/bulk (POST with body)
   */
  async bulkDelete(ids: string[]): Promise<{ count: number }> {
    return fetchAPI<{ count: number }>(`/questions/bulk`, {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
  },

  /**
   * Get question statistics
   * GET /questions/stats
   */
  async getQuestionStats(): Promise<QuestionStats> {
    return fetchAPI<QuestionStats>(`/questions/stats`);
  },

  /**
   * Get question categories with counts
   * GET /questions/categories
   */
  async getQuestionCategories(): Promise<QuestionCategory[]> {
    return fetchAPI<QuestionCategory[]>(`/questions/categories`);
  },

  /**
   * Export all questions
   * GET /questions/export
   */
  async exportQuestions(): Promise<Question[]> {
    return fetchAPI<Question[]>(`/questions/export`);
  },

  /**
   * Get daily challenge questions
   * GET /questions/daily
   */
  async getDailyChallenge(): Promise<Question[]> {
    return fetchAPI<Question[]>(`/questions/daily`);
  },
};
