import { api } from "../../api";
import { AuthResponse, CapturedMessages, LoginCredentials, User } from "./authTypes";


export const authAPI = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        console.log('api')
      const response = await api.post(`/api/auth`, { email, password });
      console.log('api', response)
      return response.data;
    },
    register: async (credentials: Omit<User, 'id'>): Promise<any> => {
      const response = await api.post("/api/auth/register", credentials);
      return response.data;
    },
    forgotPassword: async(email: string): Promise<void> => {
      console.log(email)
      const response = await api.post('/api/auth/forgot-password', {email});
      return response.data;
    },
    updateUser: async (formData: Partial<User>, user_id: number): Promise<CapturedMessages> => {
      const response = await api.post(`/api/auth/user/update/${user_id}`, formData);
      return response.data;
    },
  };
