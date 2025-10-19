import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { MessageType } from '@prisma/client';

export class MessageService {
  async getConversations(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [conversations, total] = await Promise.all([
      prisma.conversation.findMany({
        where: {
          participants: {
            some: { userId },
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatar: true,
                },
              },
            },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                  avatar: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { lastMessageAt: 'desc' },
      }),
      prisma.conversation.count({
        where: {
          participants: {
            some: { userId },
          },
        },
      }),
    ]);

    // Get unread count for each conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const participant = conv.participants.find((p) => p.userId === userId);
        const otherParticipants = conv.participants
          .filter((p) => p.userId !== userId)
          .map((p) => p.user);

        return {
          id: conv.id,
          type: conv.type,
          name: conv.name || otherParticipants[0]?.displayName,
          avatar: conv.avatar || otherParticipants[0]?.avatar,
          participants: otherParticipants,
          lastMessage: conv.messages[0] || null,
          unreadCount: participant?.unreadCount || 0,
          isArchived: participant?.isArchived || false,
          isMuted: participant?.isMuted || false,
          updatedAt: conv.updatedAt,
        };
      })
    );

    return {
      items: conversationsWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  async getOrCreateConversation(userId: string, otherUserId: string) {
    // Check if conversation already exists
    const existing = await prisma.conversation.findFirst({
      where: {
        type: 'DIRECT',
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: otherUserId } } },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (existing) {
      return existing;
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        type: 'DIRECT',
        participants: {
          create: [
            { userId },
            { userId: otherUserId },
          ],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    return conversation;
  }

  async getMessages(conversationId: string, userId: string, page: number = 1, limit: number = 50) {
    // Verify user is participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
    });

    if (!participant) {
      throw new AppError('Not a participant of this conversation', 403, 'FORBIDDEN');
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: {
          conversationId,
          deletedAt: null,
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatar: true,
            },
          },
          replyTo: {
            include: {
              sender: {
                select: {
                  id: true,
                  username: true,
                  displayName: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.message.count({
        where: {
          conversationId,
          deletedAt: null,
        },
      }),
    ]);

    // Mark messages as read
    await this.markMessagesAsRead(conversationId, userId);

    return {
      items: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    type: MessageType = 'TEXT',
    replyToId?: string
  ) {
    // Verify user is participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId,
          senderId,
        },
      },
    });

    if (!participant) {
      throw new AppError('Not a participant of this conversation', 403, 'FORBIDDEN');
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
        type,
        replyToId,
        status: 'SENT',
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    // Update conversation last message time
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    // Increment unread count for other participants
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId: { not: senderId },
      },
      data: {
        unreadCount: { increment: 1 },
      },
    });

    return message;
  }

  async markMessagesAsRead(conversationId: string, userId: string) {
    await prisma.conversationParticipant.update({
      where: {
        conversationId_userId: {
          conversationId,
          userId,
        },
      },
      data: {
        unreadCount: 0,
        lastReadAt: new Date(),
      },
    });
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new AppError('Message not found', 404, 'MESSAGE_NOT_FOUND');
    }

    if (message.senderId !== userId) {
      throw new AppError('Unauthorized to delete this message', 403, 'FORBIDDEN');
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { deletedAt: new Date() },
    });

    return { message: 'Message deleted successfully' };
  }

  async updateTypingStatus(conversationId: string, userId: string, isTyping: boolean) {
    // This will be emitted via WebSocket
    return {
      conversationId,
      userId,
      isTyping,
      timestamp: new Date(),
    };
  }
}

export const messageService = new MessageService();
