/**
 * Badge and Achievement type definitions
 */

/**
 * Badge categories for classification
 */
export type BadgeCategory = 'GENERAL' | 'QUIZ' | 'LEARNING' | 'STREAK' | 'SOCIAL' | 'CONTEST';

/**
 * Achievement types
 */
export type AchievementType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONE_TIME';

/**
 * Badge entity
 */
export interface Badge {
  id: string;
  name: string;
  nameAr: string;
  description?: string;
  icon?: string;
  xpReward: number;
  category: BadgeCategory;
  _count?: {
    users?: number;
  };
}

/**
 * User's earned badge
 */
export interface UserBadge {
  userId: string;
  badgeId: string;
  earnedAt: Date | string;
  badge?: Badge;
}

/**
 * Create badge DTO
 */
export interface CreateBadgeDto {
  name: string;
  nameAr?: string;
  description?: string;
  icon?: string;
  xpReward?: number;
  category?: BadgeCategory;
}

/**
 * Update badge DTO
 */
export interface UpdateBadgeDto {
  name?: string;
  nameAr?: string;
  description?: string;
  icon?: string;
  xpReward?: number;
  category?: BadgeCategory;
}

/**
 * Achievement entity
 */
export interface Achievement {
  id: string;
  title: string;
  titleAr: string;
  description?: string;
  icon?: string;
  type: AchievementType;
  xpReward: number;
  targetValue: number;
  category?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: {
    users?: number;
  };
}

/**
 * User's achievement progress
 */
export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  progress: number;
  isCompleted: boolean;
  completedAt?: Date | string;
  lastResetAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  achievement?: Achievement;
}

/**
 * Create achievement DTO
 */
export interface CreateAchievementDto {
  title: string;
  titleAr: string;
  description?: string;
  icon?: string;
  type?: AchievementType;
  xpReward?: number;
  targetValue: number;
  category?: string;
}

/**
 * Update achievement DTO
 */
export interface UpdateAchievementDto {
  title?: string;
  titleAr?: string;
  description?: string;
  icon?: string;
  type?: AchievementType;
  xpReward?: number;
  targetValue?: number;
  category?: string;
}
