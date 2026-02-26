/**
 * Stage and Level Types
 * Hierarchical learning structure: Category → Stage → Level → Question
 */

// ==================== STAGE ====================

export interface Stage {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  levels?: Level[];
  questions?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateStageDto {
  name: string;
  slug: string;
  description?: string;
  order: number;
  categoryId: string;
}

export interface UpdateStageDto {
  name?: string;
  slug?: string;
  description?: string;
  order?: number;
}

// ==================== LEVEL ====================

export interface Level {
  id: string;
  name: string;
  description?: string;
  order: number;
  xpReward: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  stageId: string;
  stage?: {
    id: string;
    name: string;
    slug: string;
  };
  questions?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateLevelDto {
  name: string;
  description?: string;
  order: number;
  xpReward?: number;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  stageId: string;
}

export interface UpdateLevelDto {
  name?: string;
  description?: string;
  order?: number;
  xpReward?: number;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
}

// ==================== HIERARCHY ====================

export interface StageWithLevels extends Stage {
  levels: Level[];
}

export interface LevelWithStage extends Level {
  stage: Stage;
}

export interface CategoryHierarchy {
  id: string;
  name: string;
  slug: string;
  stages: StageWithLevels[];
}

export interface HierarchicalViewData {
  categories: CategoryHierarchy[];
}
