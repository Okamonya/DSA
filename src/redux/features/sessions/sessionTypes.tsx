
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
  
export interface Session {
  date: string;
  id: string;
  title: string;
  description: string;
  sessionType: string;
  location: string;
  facilitator: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
  trainingModule?: TrainingModule;
}

export interface SessionAssignment {
  mentorId: string;
  menteeId: string;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
}


export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  contentUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

// State type
export interface SessionState {
  sessions: Session[];
  sessionsById: Session[];
  loading: boolean;
  error: string | null;
}

