import { apiService } from './api';
import { API_ENDPOINTS } from '@shared/constants';
import type { Notification, PaginatedResponse } from '@shared/types';

class NotificationsService {
  async getNotifications(page: number = 1): Promise<PaginatedResponse<Notification>> {
    return apiService.get<PaginatedResponse<Notification>>(
      API_ENDPOINTS.NOTIFICATIONS.BASE,
      { page }
    );
  }

  async markAsRead(notificationId: string): Promise<void> {
    return apiService.post<void>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId)
    );
  }

  async markAllAsRead(): Promise<void> {
    return apiService.post<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  }
}

export const notificationsService = new NotificationsService();
