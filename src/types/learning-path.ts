export interface Unit {
    id: string;
    title: string;
    description?: string;
    order: number;
    showInLibrary?: boolean;
    libraryOrder?: number;
    nodes: Node[];
    createdAt: string;
    updatedAt: string;
}

export interface Node {
    id: string;
    title: string;
    type: 'LESSON' | 'QUIZ';
    content?: string;
    order: number;
    unitId: string;
    showInLibrary?: boolean;
    libraryOrder?: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUnitDto {
    title: string;
    description?: string;
    order: number;
    showInLibrary?: boolean;
    libraryOrder?: number;
}

export interface UpdateUnitDto {
    title?: string;
    description?: string;
    order?: number;
    showInLibrary?: boolean;
    libraryOrder?: number;
}

export interface CreateNodeDto {
    title: string;
    type: 'LESSON' | 'QUIZ';
    content?: string;
    unitId: string;
    order: number;
    showInLibrary?: boolean;
    libraryOrder?: number;
}

export interface UpdateNodeDto {
    title?: string;
    type?: 'LESSON' | 'QUIZ';
    content?: string;
    unitId?: string;
    order?: number;
    showInLibrary?: boolean;
    libraryOrder?: number;
}

export interface LearningPathWithProgress {
    units: (Unit & {
        progress: {
            completedNodes: number;
            totalNodes: number;
            percentage: number;
        };
    })[];
    userProgress: any[];
}
