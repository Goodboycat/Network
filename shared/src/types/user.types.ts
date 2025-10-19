export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
  BANNED = 'BANNED',
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  role: UserRole;
  status: AccountStatus;
  isVerified: boolean;
  isPrivate: boolean;
  followers: number;
  following: number;
  postsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  location?: string;
  website?: string;
  birthDate?: Date;
  interests?: string[];
  language?: string;
  timezone?: string;
}

export interface UserSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
  language: string;
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showOnline: boolean;
    allowMessages: 'everyone' | 'following' | 'none';
  };
}

export interface UserStats {
  userId: string;
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  profileViews: number;
  engagementRate: number;
}
