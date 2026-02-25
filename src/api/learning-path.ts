import { apiClient } from '../lib/api-client';
import { Unit, Node, CreateUnitDto, UpdateUnitDto, CreateNodeDto, UpdateNodeDto, LearningPathWithProgress } from '../types/learning-path';

export const learningPathApi = {
    // Get full learning path with user progress
    getPath: async (): Promise<LearningPathWithProgress> => {
        return apiClient.get<LearningPathWithProgress>('/learning-path');
    },

    // Units
    createUnit: async (data: CreateUnitDto): Promise<Unit> => {
        return apiClient.post<Unit>('/learning-path/units', data);
    },

    updateUnit: async (id: string, data: UpdateUnitDto): Promise<Unit> => {
        return apiClient.patch<Unit>(`/learning-path/units/${id}`, data);
    },

    deleteUnit: async (id: string): Promise<void> => {
        return apiClient.delete<void>(`/learning-path/units/${id}`);
    },

    // Nodes
    createNode: async (data: CreateNodeDto): Promise<Node> => {
        return apiClient.post<Node>('/learning-path/nodes', data);
    },

    updateNode: async (id: string, data: UpdateNodeDto): Promise<Node> => {
        return apiClient.patch<Node>(`/learning-path/nodes/${id}`, data);
    },

    deleteNode: async (id: string): Promise<void> => {
        return apiClient.delete<void>(`/learning-path/nodes/${id}`);
    },

    updateNodeProgress: async (nodeId: string, completed: boolean): Promise<any> => {
        return apiClient.post<any>(`/learning-path/nodes/${nodeId}/progress`, { completed });
    }
};
