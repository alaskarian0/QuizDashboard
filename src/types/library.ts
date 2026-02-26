/**
 * Library Content Types
 * Types for Articles, Lessons, Podcasts, and E-Books
 */

// ==================== ARTICLES ====================

export interface Article {
  id: string;
  title: string;
  titleEn?: string;
  excerpt?: string;
  imageUrl?: string;
  author?: string;
  category: string;
  tags?: string; // JSON stringified array
  likes: number;
  views: number;
  isPublished: boolean;
  showInLibrary: boolean;
  libraryOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateArticleDto {
  title: string;
  titleAr?: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  author?: string;
  category?: string;
  tags?: string;
  isPublished?: boolean;
  showInLibrary?: boolean;
  libraryOrder?: number;
}

export interface UpdateArticleDto {
  title?: string;
  titleAr?: string;
  content?: string;
  excerpt?: string;
  imageUrl?: string;
  author?: string;
  category?: string;
  tags?: string;
  likes?: number;
  views?: number;
  isPublished?: boolean;
  showInLibrary?: boolean;
  libraryOrder?: number;
}

export interface ArticleFilters {
  category?: string;
  page?: number;
  limit?: number;
}

export interface ArticleListResponse {
  data: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== LESSONS ====================

export interface Lesson {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration: number; // in seconds
  category: string;
  level: string; // BEGINNER, INTERMEDIATE, ADVANCED
  xpReward: number;
  order: number;
  isPublished: boolean;
  showInLibrary: boolean;
  libraryOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonDto {
  title: string;
  titleAr: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration: number;
  category?: string;
  level?: string;
  xpReward?: number;
  order?: number;
  isPublished?: boolean;
  showInLibrary?: boolean;
  libraryOrder?: number;
}

export interface UpdateLessonDto {
  title?: string;
  titleAr?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  category?: string;
  level?: string;
  xpReward?: number;
  order?: number;
  isPublished?: boolean;
  showInLibrary?: boolean;
  libraryOrder?: number;
}

export interface LessonFilters {
  category?: string;
  level?: string;
  page?: number;
  limit?: number;
}

export interface LessonListResponse {
  data: Lesson[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== PODCASTS ====================

export interface Podcast {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  duration: number; // in seconds
  category: string;
  speaker?: string;
  xpReward: number;
  order: number;
  isPublished: boolean;
  showInLibrary: boolean;
  libraryOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePodcastDto {
  title: string;
  titleAr: string;
  description?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  duration: number;
  category?: string;
  speaker?: string;
  xpReward?: number;
  order?: number;
  isPublished?: boolean;
  showInLibrary?: boolean;
  libraryOrder?: number;
}

export interface UpdatePodcastDto {
  title?: string;
  titleAr?: string;
  description?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  category?: string;
  speaker?: string;
  xpReward?: number;
  order?: number;
  isPublished?: boolean;
  showInLibrary?: boolean;
  libraryOrder?: number;
}

export interface PodcastFilters {
  category?: string;
  page?: number;
  limit?: number;
}

export interface PodcastListResponse {
  data: Podcast[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== E-BOOKS ====================

export interface EBook {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  fileUrl: string;
  coverUrl?: string;
  author?: string;
  pages?: number;
  category: string;
  xpReward: number;
  order: number;
  isPublished: boolean;
  showInLibrary: boolean;
  libraryOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEBookDto {
  title: string;
  titleAr: string;
  description?: string;
  fileUrl: string;
  coverUrl?: string;
  author?: string;
  pages?: number;
  category?: string;
  xpReward?: number;
  order?: number;
  isPublished?: boolean;
  showInLibrary?: boolean;
  libraryOrder?: number;
}

export interface UpdateEBookDto {
  title?: string;
  titleAr?: string;
  description?: string;
  fileUrl?: string;
  coverUrl?: string;
  author?: string;
  pages?: number;
  category?: string;
  xpReward?: number;
  order?: number;
  isPublished?: boolean;
  showInLibrary?: boolean;
  libraryOrder?: number;
}

export interface EBookFilters {
  category?: string;
  page?: number;
  limit?: number;
}

export interface EBookListResponse {
  data: EBook[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==================== COMMON TYPES ====================

export type LibraryContentType = 'articles' | 'lessons' | 'podcasts' | 'ebooks';

export interface LibraryContent {
  type: LibraryContentType;
  article?: Article;
  lesson?: Lesson;
  podcast?: Podcast;
  ebook?: EBook;
}

export interface LibraryStats {
  totalArticles: number;
  totalLessons: number;
  totalPodcasts: number;
  totalEBooks: number;
  totalViews: number;
  totalLikes: number;
}
