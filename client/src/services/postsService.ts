import { apiService } from './api';
import { API_ENDPOINTS } from '@shared/constants';
import type { Post, CreatePostRequest, PaginatedResponse } from '@shared/types';

class PostsService {
  async getFeed(page: number = 1): Promise<PaginatedResponse<Post>> {
    return apiService.get<PaginatedResponse<Post>>(API_ENDPOINTS.POSTS.FEED, {
      page,
    });
  }

  async getPost(postId: string): Promise<Post> {
    return apiService.get<Post>(API_ENDPOINTS.POSTS.BY_ID(postId));
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    return apiService.get<Post[]>(API_ENDPOINTS.POSTS.USER(userId));
  }

  async createPost(data: CreatePostRequest): Promise<Post> {
    return apiService.post<Post>(API_ENDPOINTS.POSTS.BASE, data);
  }

  async updatePost(postId: string, data: Partial<CreatePostRequest>): Promise<Post> {
    return apiService.put<Post>(API_ENDPOINTS.POSTS.BY_ID(postId), data);
  }

  async deletePost(postId: string): Promise<void> {
    return apiService.delete<void>(API_ENDPOINTS.POSTS.BY_ID(postId));
  }

  async likePost(postId: string): Promise<void> {
    return apiService.post<void>(API_ENDPOINTS.POSTS.LIKE(postId));
  }

  async unlikePost(postId: string): Promise<void> {
    return apiService.delete<void>(API_ENDPOINTS.POSTS.UNLIKE(postId));
  }

  async bookmarkPost(postId: string): Promise<void> {
    return apiService.post<void>(API_ENDPOINTS.POSTS.BOOKMARK(postId));
  }
}

export const postsService = new PostsService();
