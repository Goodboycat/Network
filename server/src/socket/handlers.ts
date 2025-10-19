import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { logger } from '../utils/logger';
import { messageService } from '../services/message.service';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, config.jwt.secret) as any;
      socket.userId = decoded.userId;

      logger.info(`Socket authenticated: ${socket.id} (User: ${socket.userId})`);
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;

    logger.info(`User connected: ${userId} (${socket.id})`);

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Emit online status
    io.emit('user:online', { userId, socketId: socket.id });

    // Join conversation rooms
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      logger.debug(`User ${userId} joined conversation ${conversationId}`);
    });

    // Leave conversation rooms
    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      logger.debug(`User ${userId} left conversation ${conversationId}`);
    });

    // Handle sending messages
    socket.on('message:send', async (data: {
      conversationId: string;
      content: string;
      type?: string;
      replyToId?: string;
    }) => {
      try {
        const message = await messageService.sendMessage(
          data.conversationId,
          userId,
          data.content,
          data.type as any,
          data.replyToId
        );

        // Emit to conversation room
        io.to(`conversation:${data.conversationId}`).emit('message:new', message);

        // Emit to other participants' personal rooms for notifications
        const conversation = await messageService['prisma'].conversation.findUnique({
          where: { id: data.conversationId },
          include: { participants: true },
        });

        conversation?.participants.forEach((participant) => {
          if (participant.userId !== userId) {
            io.to(`user:${participant.userId}`).emit('message:notification', {
              conversationId: data.conversationId,
              message,
            });
          }
        });
      } catch (error: any) {
        logger.error('Error sending message:', error);
        socket.emit('message:error', { error: error.message });
      }
    });

    // Handle typing indicators
    socket.on('typing:start', (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:user', {
        conversationId: data.conversationId,
        userId,
        isTyping: true,
      });
    });

    socket.on('typing:stop', (data: { conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('typing:user', {
        conversationId: data.conversationId,
        userId,
        isTyping: false,
      });
    });

    // Handle message read receipts
    socket.on('message:read', async (data: { conversationId: string }) => {
      try {
        await messageService.markMessagesAsRead(data.conversationId, userId);

        // Notify other participants
        socket.to(`conversation:${data.conversationId}`).emit('messages:read', {
          conversationId: data.conversationId,
          userId,
        });
      } catch (error: any) {
        logger.error('Error marking messages as read:', error);
      }
    });

    // Handle post interactions
    socket.on('post:like', (data: { postId: string; liked: boolean }) => {
      // Broadcast to all users (for real-time like count updates)
      io.emit('post:liked', {
        postId: data.postId,
        liked: data.liked,
        userId,
      });
    });

    socket.on('post:comment', (data: { postId: string; comment: any }) => {
      // Broadcast new comment
      io.emit('post:commented', {
        postId: data.postId,
        comment: data.comment,
      });
    });

    // Handle notifications
    socket.on('notification:read', (notificationId: string) => {
      // Could emit back to confirm
      socket.emit('notification:read:confirmed', notificationId);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${userId} (${socket.id})`);

      // Emit offline status
      io.emit('user:offline', { userId, socketId: socket.id });
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${userId}:`, error);
    });
  });

  return io;
};

// Helper function to emit to specific user
export const emitToUser = (io: Server, userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data);
};

// Helper function to emit to conversation
export const emitToConversation = (io: Server, conversationId: string, event: string, data: any) => {
  io.to(`conversation:${conversationId}`).emit(event, data);
};

// Helper function to emit notification
export const emitNotification = (io: Server, userId: string, notification: any) => {
  io.to(`user:${userId}`).emit('notification:new', notification);
};
