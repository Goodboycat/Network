export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
}

export enum MessageStatus {
  SENDING = 'SENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  mediaUrl?: string;
  replyToId?: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface MessageWithSender extends Message {
  sender: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  replyTo?: Message;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  avatar?: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isArchived: boolean;
  isMuted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationWithDetails extends Conversation {
  participantDetails: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
  }[];
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  username: string;
  timestamp: Date;
}
