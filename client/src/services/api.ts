import axios, { AxiosError, AxiosInstance } from 'axios';
import { AuthTokens } from '@shared';

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: '/api/v1',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            // If already refreshing, wait for that
            if (this.refreshPromise) {
              const newToken = await this.refreshPromise;
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }

            // Start refresh process
            this.refreshPromise = this.refreshAccessToken(refreshToken);
            const newToken = await this.refreshPromise;
            this.refreshPromise = null;

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshAccessToken(refreshToken: string): Promise<string> {
    const response = await axios.post('/api/v1/auth/refresh-token', {
      refreshToken,
    });

    const tokens: AuthTokens = response.data.data.tokens;
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    return tokens.accessToken;
  }

  private clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Auth endpoints
  async register(data: {
    email: string;
    username: string;
    password: string;
    displayName: string;
  }) {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async logout() {
    const response = await this.client.post('/auth/logout');
    this.clearTokens();
    return response.data;
  }

  async getMe() {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  // User endpoints
  async getUserById(userId: string) {
    const response = await this.client.get(`/users/${userId}`);
    return response.data;
  }

  async getUserByUsername(username: string) {
    const response = await this.client.get(`/users/username/${username}`);
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await this.client.patch('/users/me', data);
    return response.data;
  }

  async followUser(userId: string) {
    const response = await this.client.post(`/users/${userId}/follow`);
    return response.data;
  }

  async unfollowUser(userId: string) {
    const response = await this.client.delete(`/users/${userId}/follow`);
    return response.data;
  }

  async searchUsers(query: string, page = 1, limit = 20) {
    const response = await this.client.get('/users/search', {
      params: { query, page, limit },
    });
    return response.data;
  }

  // Post endpoints
  async createPost(data: {
    content: string;
    type?: string;
    visibility?: string;
    media?: any[];
  }) {
    const response = await this.client.post('/posts', data);
    return response.data;
  }

  async getPost(postId: string) {
    const response = await this.client.get(`/posts/${postId}`);
    return response.data;
  }

  async getFeed(page = 1, limit = 20) {
    const response = await this.client.get('/posts/feed', {
      params: { page, limit },
    });
    return response.data;
  }

  async getUserPosts(userId: string, page = 1, limit = 20) {
    const response = await this.client.get(`/posts/user/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  }

  async likePost(postId: string) {
    const response = await this.client.post(`/posts/${postId}/like`);
    return response.data;
  }

  async deletePost(postId: string) {
    const response = await this.client.delete(`/posts/${postId}`);
    return response.data;
  }

  // Comment endpoints
  async getComments(postId: string, page = 1, limit = 20) {
    const response = await this.client.get(`/posts/${postId}/comments`, {
      params: { page, limit },
    });
    return response.data;
  }

  async createComment(postId: string, content: string, parentId?: string) {
    const response = await this.client.post(`/posts/${postId}/comments`, {
      content,
      parentId,
    });
    return response.data;
  }

  async deleteComment(postId: string, commentId: string) {
    const response = await this.client.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  }

  // Notification endpoints
  async getNotifications(page = 1, limit = 20) {
    const response = await this.client.get('/notifications', {
      params: { page, limit },
    });
    return response.data;
  }

  async markNotificationRead(notificationId: string) {
    const response = await this.client.patch(`/notifications/${notificationId}/read`);
    return response.data;
  }

  async markAllNotificationsRead() {
    const response = await this.client.patch('/notifications/read-all');
    return response.data;
  }

  // Message endpoints
  async getConversations(page = 1, limit = 20) {
    const response = await this.client.get('/messages/conversations', {
      params: { page, limit },
    });
    return response.data;
  }

  async getMessages(conversationId: string, page = 1, limit = 50) {
    const response = await this.client.get(`/messages/conversations/${conversationId}`, {
      params: { page, limit },
    });
    return response.data;
  }

  async sendMessage(conversationId: string, content: string, type = 'TEXT') {
    const response = await this.client.post(`/messages/conversations/${conversationId}`, {
      content,
      type,
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
