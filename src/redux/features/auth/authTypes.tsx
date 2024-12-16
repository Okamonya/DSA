export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: CapturedMessages | null;
}

export interface User {
    id: string;
    email: string;
    role: string;
    password: string;
    region: string;
    username: string;
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