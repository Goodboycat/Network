import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Post, CreatePostRequest } from '@shared/types';
import { postsService } from '../../services/postsService';

interface PostsState {
  feed: Post[];
  userPosts: Record<string, Post[]>;
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const initialState: PostsState = {
  feed: [],
  userPosts: {},
  currentPost: null,
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,
};

// Async thunks
export const fetchFeed = createAsyncThunk(
  'posts/fetchFeed',
  async ({ page = 1 }: { page?: number }, { rejectWithValue }) => {
    try {
      const response = await postsService.getFeed(page);
      return { posts: response.items, hasMore: response.hasMore, page };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async (userId: string, { rejectWithValue }) => {
    try {
      const posts = await postsService.getUserPosts(userId);
      return { userId, posts };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (data: CreatePostRequest, { rejectWithValue }) => {
    try {
      const post = await postsService.createPost(data);
      return post;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await postsService.likePost(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await postsService.unlikePost(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId: string, { rejectWithValue }) => {
    try {
      await postsService.deletePost(postId);
      return postId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.feed.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.feed.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.feed[index] = action.payload;
      }
    },
    resetFeed: (state) => {
      state.feed = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch feed
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.page === 1) {
          state.feed = action.payload.posts;
        } else {
          state.feed.push(...action.payload.posts);
        }
        state.hasMore = action.payload.hasMore;
        state.page = action.payload.page;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch user posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userPosts[action.payload.userId] = action.payload.posts;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.feed.find(p => p.id === action.payload);
        if (post) {
          post.isLiked = true;
          post.likesCount += 1;
        }
      })
      // Unlike post
      .addCase(unlikePost.fulfilled, (state, action) => {
        const post = state.feed.find(p => p.id === action.payload);
        if (post) {
          post.isLiked = false;
          post.likesCount -= 1;
        }
      })
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.feed = state.feed.filter(p => p.id !== action.payload);
      });
  },
});

export const { clearError, addPost, updatePost, resetFeed } = postsSlice.actions;
export default postsSlice.reducer;
