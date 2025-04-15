
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

export interface UserTraining {
    id: string;
    trainingModuleId: string;
    status: string;
    current: boolean;
    progress: number;
    enrolledAt: Date;
    trainingModule: TrainingModule
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
    userTrainings: UserTraining[];
    success: boolean;
    loading: boolean;
    error: string | null;
}

