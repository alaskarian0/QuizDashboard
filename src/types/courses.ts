/**
 * Course Types
 * Matches the backend Course entity and DTOs
 */

export interface Course {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  showOnHome?: boolean;
  showOnHomeOrder?: number;
  showAsChallenge?: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  // Fields added by the API when including counts
  questionCount?: number;
  _count?: {
    questions?: number;
  };
}

export interface CreateCourseDto {
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  showOnHome?: boolean;
  showOnHomeOrder?: number;
  showAsChallenge?: boolean;
  imageUrl?: string;
}

export interface UpdateCourseDto {
  name?: string;
  slug?: string;
  icon?: string;
  color?: string;
  description?: string;
  showOnHome?: boolean;
  showOnHomeOrder?: number;
  showAsChallenge?: boolean;
  imageUrl?: string;
}

export interface CourseListResponse {
  data: Course[];
  total: number;
}

export interface CourseDetailResponse extends Course {
  questionsCount: number;
}
