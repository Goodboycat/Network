export enum NotificationType {
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW',
  MENTION = 'MENTION',
  REPLY = 'REPLY',
  SHARE = 'SHARE',
  MESSAGE = 'MESSAGE',
  SYSTEM = 'SYSTEM',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actorId?: string;
  targetId?: string;
  targetType?: 'post' | 'comment' | 'user' | 'message';
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationWithActor extends Notification {
  actor?: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
}

export interface NotificationPreferences {
  userId: string;
  likes: boolean;
  comments: boolean;
  follows: boolean;
  mentions: boolean;
  messages: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}
