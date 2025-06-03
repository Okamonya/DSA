import { api } from "../../api";
import { AuthResponse, CapturedMessages, LoginCredentials, User } from "./authTypes";


export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post(`/api/auth`, { email, password });
    return response.data;
  },
  logout: async (): Promise<void> => {
    await api.post(`/api/logout`);
  },
  register: async (credentials: Omit<User, 'id' | 'role'>): Promise<any> => {
    const response = await api.post("/api/auth/register", credentials);
    return response.data;
  },
  forgotPassword: async (email: string): Promise<void> => {
    console.log(email)
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  },
  updateUser: async (formData: Partial<User>, user_id: string): Promise<CapturedMessages> => {
    const response = await api.patch(`/api/users/update/user/${user_id}`, formData);
    return response.data;
  },
  fetchUsers: async (id: string): Promise<User[]> => {
    const response = await api.get(`/api/users`);
    return response.data;
  },

};
