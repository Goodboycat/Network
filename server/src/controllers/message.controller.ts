import { Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { messageService } from '../services/message.service';

export class MessageController {
  // Validation rules
  static sendMessageValidation = [
    param('conversationId').isString().notEmpty(),
    body('content').isString().notEmpty().isLength({ min: 1, max: 5000 }),
    body('type').optional().isIn(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE']),
    body('replyToId').optional().isString(),
  ];

  async getConversations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await messageService.getConversations(userId, page, limit);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrCreateConversation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { otherUserId } = req.body;

      const conversation = await messageService.getOrCreateConversation(userId, otherUserId);

      res.json({
        success: true,
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { conversationId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await messageService.getMessages(conversationId, userId, page, limit);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const senderId = req.user!.id;
      const { conversationId } = req.params;
      const { content, type, replyToId } = req.body;

      const message = await messageService.sendMessage(
        conversationId,
        senderId,
        content,
        type,
        replyToId
      );

      res.status(201).json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { conversationId } = req.params;

      await messageService.markMessagesAsRead(conversationId, userId);

      res.json({
        success: true,
        data: { message: 'Messages marked as read' },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { messageId } = req.params;

      const result = await messageService.deleteMessage(messageId, userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const messageController = new MessageController();
