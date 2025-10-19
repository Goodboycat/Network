// ============================================================================
// API Constants
// ============================================================================

export const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000';
export const SOCKET_URL = import.meta.env?.VITE_SOCKET_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
    VERIFY_EMAIL: '/api/auth/verify-email',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  // Users
  USERS: {
    BASE: '/api/users',
    BY_ID: (id: string) => `/api/users/${id}`,
    PROFILE: (username: string) => `/api/users/profile/${username}`,
    UPDATE: '/api/users/me',
    AVATAR: '/api/users/me/avatar',
    COVER: '/api/users/me/cover',
    SEARCH: '/api/users/search',
  },
  // Posts
  POSTS: {
    BASE: '/api/posts',
    BY_ID: (id: string) => `/api/posts/${id}`,
    FEED: '/api/posts/feed',
    USER: (userId: string) => `/api/posts/user/${userId}`,
    LIKE: (id: string) => `/api/posts/${id}/like`,
    UNLIKE: (id: string) => `/api/posts/${id}/unlike`,
    BOOKMARK: (id: string) => `/api/posts/${id}/bookmark`,
  },
  // Comments
  COMMENTS: {
    BASE: '/api/comments',
    BY_POST: (postId: string) => `/api/comments/post/${postId}`,
    LIKE: (id: string) => `/api/comments/${id}/like`,
  },
  // Messages
  MESSAGES: {
    BASE: '/api/messages',
    CONVERSATIONS: '/api/messages/conversations',
    BY_CONVERSATION: (id: string) => `/api/messages/conversations/${id}`,
    SEND: '/api/messages/send',
    READ: (id: string) => `/api/messages/${id}/read`,
  },
  // Notifications
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: '/api/notifications/read-all',
  },
  // Connections
  CONNECTIONS: {
    FOLLOW: (userId: string) => `/api/connections/follow/${userId}`,
    UNFOLLOW: (userId: string) => `/api/connections/unfollow/${userId}`,
    FOLLOWERS: (userId: string) => `/api/connections/followers/${userId}`,
    FOLLOWING: (userId: string) => `/api/connections/following/${userId}`,
  },
  // Media
  MEDIA: {
    UPLOAD: '/api/media/upload',
    DELETE: (id: string) => `/api/media/${id}`,
  },
  // Search
  SEARCH: {
    ALL: '/api/search',
    USERS: '/api/search/users',
    POSTS: '/api/search/posts',
    HASHTAGS: '/api/search/hashtags',
  },
  // Analytics
  ANALYTICS: {
    USER: '/api/analytics/user',
    POST: (id: string) => `/api/analytics/post/${id}`,
  },
} as const;

// ============================================================================
// Application Constants
// ============================================================================

export const APP_NAME = 'Network';
export const APP_DESCRIPTION = 'Next-generation social collaboration platform';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const POST_MAX_LENGTH = 5000;
export const COMMENT_MAX_LENGTH = 1000;
export const MESSAGE_MAX_LENGTH = 2000;
export const BIO_MAX_LENGTH = 500;

export const POSTS_PER_PAGE = 20;
export const COMMENTS_PER_PAGE = 50;
export const MESSAGES_PER_PAGE = 50;
export const NOTIFICATIONS_PER_PAGE = 30;
export const SEARCH_RESULTS_PER_PAGE = 20;

// ============================================================================
// Validation Constants
// ============================================================================

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ============================================================================
// UI Constants
// ============================================================================

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const TOAST_DURATION = 5000; // 5 seconds
export const DEBOUNCE_DELAY = 300; // 300ms
export const ANIMATION_DURATION = 200; // 200ms

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'network_auth_token',
  REFRESH_TOKEN: 'network_refresh_token',
  USER: 'network_user',
  THEME: 'network_theme',
  LANGUAGE: 'network_language',
  DRAFT_POST: 'network_draft_post',
} as const;

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You need to be logged in to perform this action.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  SERVER: 'Server error. Please try again later.',
} as const;

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  LOGIN: 'Welcome back!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Logged out successfully.',
  POST_CREATED: 'Post created successfully!',
  POST_UPDATED: 'Post updated successfully!',
  POST_DELETED: 'Post deleted successfully.',
  COMMENT_ADDED: 'Comment added successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  MESSAGE_SENT: 'Message sent!',
  FOLLOW: 'Following successfully!',
  UNFOLLOW: 'Unfollowed successfully.',
} as const;

// ============================================================================
// Date Formats
// ============================================================================

export const DATE_FORMATS = {
  FULL: 'MMMM dd, yyyy HH:mm',
  SHORT: 'MMM dd, yyyy',
  TIME: 'HH:mm',
  RELATIVE: 'relative',
} as const;

// ============================================================================
// Socket Events (Mirror from shared types)
// ============================================================================

export { SocketEvent } from '../types';
