export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    users: User[];
    token: string | null;
    loading: boolean;
    error: CapturedMessages | null;
}

export interface User {
    id: string;
    email: string;
    phoneNumber: string;
    password: string;
    districtId: string;
    username: string;
    role: string;
    hasSeenTraining: boolean;
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface AuthResponse {
    accessToken: string | null;
    roles: string;
    foundUser: User;
    token: string;
    message: string | undefined
}

export interface CapturedMessages {
    message: string;
    status_code: number;
}