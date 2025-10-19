import { prisma } from '../config/database';
import { NotificationType } from '@prisma/client';

export class NotificationService {
  async getNotifications(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        include: {
          actor: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
              isVerified: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return {
      items: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
      unreadCount,
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found');
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return { message: 'Notification marked as read' };
  }

  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    return { message: 'All notifications marked as read' };
  }

  async createNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    actorId?: string;
    targetId?: string;
    targetType?: string;
  }) {
    // Don't create notification if actor is the same as user
    if (data.actorId === data.userId) {
      return null;
    }

    const notification = await prisma.notification.create({
      data,
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            isVerified: true,
          },
        },
      },
    });

    return notification;
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found');
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: 'Notification deleted' };
  }

  async getUnreadCount(userId: string) {
    const count = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { count };
  }
}

export const notificationService = new NotificationService();
