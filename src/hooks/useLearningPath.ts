import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { learningPathApi } from '../api/learning-path';
import { CreateUnitDto, UpdateUnitDto, CreateNodeDto, UpdateNodeDto } from '../types/learning-path';

export const learningPathKeys = {
    all: ['learning-path'] as const,
    units: () => [...learningPathKeys.all, 'units'] as const,
    nodes: () => [...learningPathKeys.all, 'nodes'] as const,
};

export function useLearningPath() {
    return useQuery({
        queryKey: learningPathKeys.all,
        queryFn: () => learningPathApi.getPath(),
    });
}

// Units Mutations
export function useCreateUnit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateUnitDto) => learningPathApi.createUnit(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: learningPathKeys.all });
        },
    });
}

export function useUpdateUnit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUnitDto }) =>
            learningPathApi.updateUnit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: learningPathKeys.all });
        },
    });
}

export function useDeleteUnit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => learningPathApi.deleteUnit(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: learningPathKeys.all });
        },
    });
}

// Nodes Mutations
export function useCreateNode() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateNodeDto) => learningPathApi.createNode(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: learningPathKeys.all });
        },
    });
}

export function useUpdateNode() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateNodeDto }) =>
            learningPathApi.updateNode(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: learningPathKeys.all });
        },
    });
}

export function useDeleteNode() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => learningPathApi.deleteNode(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: learningPathKeys.all });
        },
    });
}

export function useUpdateNodeProgress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ nodeId, completed }: { nodeId: string; completed: boolean }) =>
            learningPathApi.updateNodeProgress(nodeId, completed),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: learningPathKeys.all });
        },
    });
}
