/**
 * Category Types
 * Matches the backend Category entity and DTOs
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  // Fields added by the API when including counts
  questionCount?: number;
  _count?: {
    questions?: number;
  };
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  icon?: string;
  color?: string;
  description?: string;
}

export interface CategoryListResponse {
  data: Category[];
  total: number;
}

export interface CategoryDetailResponse extends Category {
  questionsCount: number;
}
