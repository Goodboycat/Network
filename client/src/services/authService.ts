import { apiService } from './api';
import { API_ENDPOINTS } from '@shared/constants';
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@shared/types';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
  }

  async logout(): Promise<void> {
    return apiService.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async getCurrentUser(): Promise<User> {
    return apiService.get<User>(API_ENDPOINTS.AUTH.ME);
  }

  async verifyEmail(token: string): Promise<void> {
    return apiService.post<void>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token });
  }

  async forgotPassword(email: string): Promise<void> {
    return apiService.post<void>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    return apiService.post<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      password,
    });
  }
}

export const authService = new AuthService();
