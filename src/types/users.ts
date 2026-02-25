/**
 * User types matching the backend Prisma schema
 */

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
}

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar: string | null;
  role: UserRole;
  status: UserStatus;
  xp: number;
  level: number;
  streak: number;
  questionsAnswered: number;
  accuracy: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
}

export interface UserStats {
  totalAnswered: number;
  accuracy: number;
  level: number;
  xp: number;
  streak: number;
  badges: number;
  completedNodes: number;
  totalProgress: number;
  completionPercentage: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string | null;
  xp: number;
  level: number;
  streak: number;
  rank?: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  period?: string;
  total?: number;
}

export interface UpdateUserStatusDto {
  status: UserStatus;
}

export interface UpdateUserDto {
  name?: string;
  avatar?: string;
}

export interface UserFilters {
  status?: UserStatus | 'ALL';
  role?: UserRole;
  search?: string;
  sortBy?: 'xp' | 'level' | 'accuracy' | 'streak' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface UserRank {
  rank: number;
  xp: number;
}
