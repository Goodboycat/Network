// ============================================================================
// User Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  birthdate?: Date;
  verified: boolean;
  role: UserRole;
  privacySettings: PrivacySettings;
  createdAt: Date;
  updatedAt: Date;
  followers?: number;
  following?: number;
  postsCount?: number;
}

export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'connections' | 'private';
  showEmail: boolean;
  showLocation: boolean;
  showBirthdate: boolean;
  allowMessages: 'everyone' | 'connections' | 'none';
  allowTagging: boolean;
  showOnlineStatus: boolean;
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ============================================================================
// Post Types
// ============================================================================

export interface Post {
  id: string;
  authorId: string;
  author: User;
  content: string;
  media?: Media[];
  visibility: PostVisibility;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export enum PostVisibility {
  PUBLIC = 'PUBLIC',
  CONNECTIONS = 'CONNECTIONS',
  PRIVATE = 'PRIVATE',
}

export interface CreatePostRequest {
  content: string;
  media?: string[];
  visibility: PostVisibility;
  tags?: string[];
}

// ============================================================================
// Comment Types
// ============================================================================

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  likesCount: number;
  isLiked?: boolean;
  parentId?: string;
  replies?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentRequest {
  postId: string;
  content: string;
  parentId?: string;
}

// ============================================================================
// Message Types
// ============================================================================

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  media?: Media[];
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  media?: string[];
}

// ============================================================================
// Notification Types
// ============================================================================

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  MENTION = 'MENTION',
  FOLLOW = 'FOLLOW',
  MESSAGE = 'MESSAGE',
  SYSTEM = 'SYSTEM',
}

// ============================================================================
// Connection Types
// ============================================================================

export interface Connection {
  id: string;
  followerId: string;
  followingId: string;
  follower?: User;
  following?: User;
  createdAt: Date;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  from: User;
  status: ConnectionRequestStatus;
  createdAt: Date;
}

export enum ConnectionRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

// ============================================================================
// Media Types
// ============================================================================

export interface Media {
  id: string;
  url: string;
  type: MediaType;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  size: number;
  mimeType: string;
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
}

// ============================================================================
// Search Types
// ============================================================================

export interface SearchRequest {
  query: string;
  type?: SearchType;
  limit?: number;
  offset?: number;
}

export enum SearchType {
  ALL = 'ALL',
  USERS = 'USERS',
  POSTS = 'POSTS',
  HASHTAGS = 'HASHTAGS',
}

export interface SearchResponse {
  users: User[];
  posts: Post[];
  hashtags: string[];
  total: number;
}

// ============================================================================
// Analytics Types
// ============================================================================

export interface UserAnalytics {
  userId: string;
  profileViews: number;
  postViews: number;
  engagementRate: number;
  topPosts: Post[];
  followersGrowth: GrowthData[];
  demographicData: DemographicData;
}

export interface GrowthData {
  date: Date;
  value: number;
}

export interface DemographicData {
  ageGroups: Record<string, number>;
  locations: Record<string, number>;
  interests: Record<string, number>;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// WebSocket Event Types
// ============================================================================

export enum SocketEvent {
  // Connection events
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',

  // User events
  USER_ONLINE = 'user:online',
  USER_OFFLINE = 'user:offline',
  USER_TYPING = 'user:typing',

  // Message events
  MESSAGE_SENT = 'message:sent',
  MESSAGE_RECEIVED = 'message:received',
  MESSAGE_READ = 'message:read',

  // Notification events
  NOTIFICATION_RECEIVED = 'notification:received',
  NOTIFICATION_READ = 'notification:read',

  // Post events
  POST_CREATED = 'post:created',
  POST_UPDATED = 'post:updated',
  POST_DELETED = 'post:deleted',
  POST_LIKED = 'post:liked',
  POST_COMMENTED = 'post:commented',
}

export interface SocketPayload<T = any> {
  event: SocketEvent;
  data: T;
  timestamp: Date;
}
