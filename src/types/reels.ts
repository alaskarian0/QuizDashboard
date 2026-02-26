/**
 * Reels type definitions
 */

/**
 * Media types for reels
 */
export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO';

/**
 * UserReel entity - user-generated educational content
 */
export interface UserReel {
  id: string;
  userId: string;
  title: string;
  description?: string;
  mediaUrl?: string;
  mediaType: MediaType;
  xpReward: number;
  isActive: boolean;
  expiresAt?: Date | string;
  views: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: {
    id: string;
    username?: string;
    name?: string;
  };
}

/**
 * Create reel DTO
 */
export interface CreateReelDto {
  title: string;
  description?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  xpReward?: number;
  isActive?: boolean;
  expiresAt?: string;
}

/**
 * Update reel DTO
 */
export interface UpdateReelDto {
  title?: string;
  description?: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  xpReward?: number;
  isActive?: boolean;
  expiresAt?: string;
}

/**
 * Reel status based on active state and expiration
 */
export type ReelStatus = 'active' | 'expired' | 'inactive';
