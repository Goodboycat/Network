import { Router } from 'express';
import { postController } from '../controllers/post.controller';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// Create post
router.post(
  '/',
  authenticateToken,
  postController.constructor.createPostValidation,
  validate,
  postController.createPost.bind(postController)
);

// Get feed
router.get(
  '/feed',
  authenticateToken,
  postController.getFeed.bind(postController)
);

// Get post by ID
router.get(
  '/:postId',
  authenticateToken,
  postController.constructor.getPostValidation,
  validate,
  postController.getPostById.bind(postController)
);

// Get user posts
router.get(
  '/user/:userId',
  authenticateToken,
  postController.getUserPosts.bind(postController)
);

// Like/unlike post
router.post(
  '/:postId/like',
  authenticateToken,
  postController.likePost.bind(postController)
);

// Delete post
router.delete(
  '/:postId',
  authenticateToken,
  postController.deletePost.bind(postController)
);

export default router;
