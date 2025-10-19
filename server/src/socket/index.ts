import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyAccessToken } from '../config/jwt';
import { logger } from '../config/logger';

interface AuthSocket extends Socket {
  userId?: string;
}

const userSockets = new Map<string, string>(); // userId -> socketId
const socketUsers = new Map<string, string>(); // socketId -> userId

export const initializeSocket = (io: SocketIOServer) => {
  // Authentication middleware
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: Token not provided'));
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return next(new Error('Authentication error: Invalid token'));
    }

    socket.userId = payload.userId;
    next();
  });

  io.on('connection', (socket: AuthSocket) => {
    const userId = socket.userId!;
    logger.info(`User connected: ${userId}`);

    // Store user-socket mapping
    userSockets.set(userId, socket.id);
    socketUsers.set(socket.id, userId);

    // Broadcast user online status
    socket.broadcast.emit('user:online', { userId });

    // Join user's personal room
    socket.join(`user:${userId}`);

    // Handle typing events
    socket.on('user:typing', (data: { conversationId: string; typing: boolean }) => {
      socket.to(`conversation:${data.conversationId}`).emit('user:typing', {
        userId,
        conversationId: data.conversationId,
        typing: data.typing,
      });
    });

    // Handle message sent
    socket.on('message:sent', (data: any) => {
      socket.to(`conversation:${data.conversationId}`).emit('message:received', data);
    });

    // Handle message read
    socket.on('message:read', (data: { messageId: string; conversationId: string }) => {
      socket.to(`conversation:${data.conversationId}`).emit('message:read', {
        messageId: data.messageId,
        userId,
      });
    });

    // Join conversation room
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      logger.info(`User ${userId} joined conversation ${conversationId}`);
    });

    // Leave conversation room
    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      logger.info(`User ${userId} left conversation ${conversationId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${userId}`);
      
      // Remove user-socket mapping
      userSockets.delete(userId);
      socketUsers.delete(socket.id);

      // Broadcast user offline status
      socket.broadcast.emit('user:offline', { userId });
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error for user ${userId}:`, error);
    });
  });

  logger.info('Socket.IO initialized');
};

// Helper function to emit to specific user
export const emitToUser = (io: SocketIOServer, userId: string, event: string, data: any) => {
  const socketId = userSockets.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

// Helper function to emit to conversation
export const emitToConversation = (
  io: SocketIOServer,
  conversationId: string,
  event: string,
  data: any
) => {
  io.to(`conversation:${conversationId}`).emit(event, data);
};

// Helper function to check if user is online
export const isUserOnline = (userId: string): boolean => {
  return userSockets.has(userId);
};

// Helper function to get online users
export const getOnlineUsers = (): string[] => {
  return Array.from(userSockets.keys());
};
