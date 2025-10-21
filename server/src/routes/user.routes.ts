import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Get user by ID
router.get(
  '/:userId',
  authenticateToken,
  userController.constructor.getUserValidation,
  validate,
  userController.getUserById.bind(userController)
);

// Get user by username
router.get(
  '/username/:username',
  authenticateToken,
  userController.getUserByUsername.bind(userController)
);

// Update profile
router.patch(
  '/me',
  authenticateToken,
  userController.constructor.updateProfileValidation,
  validate,
  userController.updateProfile.bind(userController)
);

// Update settings
router.patch(
  '/me/settings',
  authenticateToken,
  userController.updateSettings.bind(userController)
);

// Follow user
router.post(
  '/:userId/follow',
  authenticateToken,
  userController.followUser.bind(userController)
);

// Unfollow user
router.delete(
  '/:userId/follow',
  authenticateToken,
  userController.unfollowUser.bind(userController)
);

// Get followers
router.get(
  '/:userId/followers',
  authenticateToken,
  userController.getFollowers.bind(userController)
);

// Get following
router.get(
  '/:userId/following',
  authenticateToken,
  userController.getFollowing.bind(userController)
);

// Search users
router.get(
  '/search',
  authenticateToken,
  userController.constructor.searchUsersValidation,
  validate,
  userController.searchUsers.bind(userController)
);

export default router;
