
export interface Course {
    progress?: any;
    id: string;
    title: string;
    category: string;
    price: number;
    discountPrice?: number;
    rating: number;
    studentsEnrolled: number;
    status?: "ongoing" | "completed" | "enrolled";
}

export interface TrainingModule {
    id: string;
    title: string;
    description: string;
    contentUrl: string;
    posterUrl?: string;
}

export interface EnrollInTrainingModule {
    userId?: string;
    trainingModuleId?: string;
}

export interface CapturedMessages {
    status_code: number;
    message: string;
}

export interface TrainingState {
    trainingModules: TrainingModule[];
    trainingModule: TrainingModule | null;
    currentTraining?: TrainingModule;
    success: boolean;
    loading: boolean;
    error: string | null;
}

