// Question Types matching backend DTOs

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

export interface Question {
  id: string;
  text: string;
  imageUrl?: string;
  difficulty: Difficulty;
  options: string[];
  correctOption: number;
  explanation?: string;
  categoryId: string;
  category?: Category;
  showAsChallenge?: boolean;
  challengeOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuestionDto {
  text: string;
  imageUrl?: string;
  difficulty: Difficulty;
  options: string[];
  correctOption: number;
  explanation?: string;
  categoryId: string;
  showAsChallenge?: boolean;
  challengeOrder?: number;
}

export interface UpdateQuestionDto {
  text?: string;
  imageUrl?: string;
  difficulty?: Difficulty;
  options?: string[];
  correctOption?: number;
  explanation?: string;
  categoryId?: string;
  showAsChallenge?: boolean;
  challengeOrder?: number;
}

export interface QueryQuestionsDto {
  categoryId?: string;
  difficulty?: Difficulty;
  page?: number;
  limit?: number;
}

export interface QuestionStats {
  total: number;
  byDifficulty: Array<{
    difficulty: Difficulty;
    count: number;
  }>;
  byCategory: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
}

export interface QuestionCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  questionCount: number;
}

export interface BulkDeleteDto {
  ids: string[];
}
