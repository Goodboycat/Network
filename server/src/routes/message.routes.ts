import { Router } from 'express';
import { messageController } from '../controllers/message.controller';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Get conversations
router.get(
  '/conversations',
  authenticateToken,
  messageController.getConversations.bind(messageController)
);

// Create or get conversation
router.post(
  '/conversations',
  authenticateToken,
  messageController.getOrCreateConversation.bind(messageController)
);

// Get messages
router.get(
  '/conversations/:conversationId',
  authenticateToken,
  messageController.getMessages.bind(messageController)
);

// Send message
router.post(
  '/conversations/:conversationId',
  authenticateToken,
  messageController.constructor.sendMessageValidation,
  validate,
  messageController.sendMessage.bind(messageController)
);

// Mark messages as read
router.patch(
  '/conversations/:conversationId/read',
  authenticateToken,
  messageController.markAsRead.bind(messageController)
);

// Delete message
router.delete(
  '/messages/:messageId',
  authenticateToken,
  messageController.deleteMessage.bind(messageController)
);

export default router;
