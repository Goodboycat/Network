// Export all types
export * from './types/user.types';
export * from './types/post.types';
export * from './types/message.types';
export * from './types/notification.types';
export * from './types/auth.types';
export * from './types/api.types';

// Export constants
export const API_VERSION = 'v1';
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/webm', 'video/ogg'];
export const MAX_POST_LENGTH = 5000;
export const MAX_COMMENT_LENGTH = 1000;
export const MAX_BIO_LENGTH = 500;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const PASSWORD_MIN_LENGTH = 8;
