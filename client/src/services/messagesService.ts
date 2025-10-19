import { apiService } from './api';
import { API_ENDPOINTS } from '@shared/constants';
import type { Message, Conversation, SendMessageRequest } from '@shared/types';

class MessagesService {
  async getConversations(): Promise<Conversation[]> {
    return apiService.get<Conversation[]>(API_ENDPOINTS.MESSAGES.CONVERSATIONS);
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    return apiService.get<Conversation>(
      API_ENDPOINTS.MESSAGES.BY_CONVERSATION(conversationId)
    );
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return apiService.get<Message[]>(
      `${API_ENDPOINTS.MESSAGES.BY_CONVERSATION(conversationId)}/messages`
    );
  }

  async sendMessage(data: SendMessageRequest): Promise<Message> {
    return apiService.post<Message>(API_ENDPOINTS.MESSAGES.SEND, data);
  }

  async markAsRead(messageId: string): Promise<void> {
    return apiService.post<void>(API_ENDPOINTS.MESSAGES.READ(messageId));
  }
}

export const messagesService = new MessagesService();
