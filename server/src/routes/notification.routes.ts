import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Get notifications
router.get(
  '/',
  authenticateToken,
  notificationController.getNotifications.bind(notificationController)
);

// Get unread count
router.get(
  '/unread-count',
  authenticateToken,
  notificationController.getUnreadCount.bind(notificationController)
);

// Mark notification as read
router.patch(
  '/:notificationId/read',
  authenticateToken,
  notificationController.constructor.notificationIdValidation,
  validate,
  notificationController.markAsRead.bind(notificationController)
);

// Mark all as read
router.patch(
  '/read-all',
  authenticateToken,
  notificationController.markAllAsRead.bind(notificationController)
);

// Delete notification
router.delete(
  '/:notificationId',
  authenticateToken,
  notificationController.constructor.notificationIdValidation,
  validate,
  notificationController.deleteNotification.bind(notificationController)
);

export default router;
