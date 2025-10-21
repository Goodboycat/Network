import { Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { postService } from '../services/post.service';

export class PostController {
  // Validation rules
  static createPostValidation = [
    body('content').isString().notEmpty().isLength({ min: 1, max: 5000 }),
    body('type').optional().isIn(['TEXT', 'IMAGE', 'VIDEO', 'LINK', 'POLL']),
    body('visibility').optional().isIn(['PUBLIC', 'FOLLOWERS', 'FRIENDS', 'PRIVATE']),
    body('media').optional().isArray(),
  ];

  static getPostValidation = [param('postId').isString().notEmpty()];

  async createPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const post = await postService.createPost(userId, req.body);

      res.status(201).json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPostById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { postId } = req.params;
      const currentUserId = req.user?.id;

      const post = await postService.getPostById(postId, currentUserId);

      res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFeed(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await postService.getFeed(userId, page, limit);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserPosts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await postService.getUserPosts(userId, currentUserId, page, limit);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async likePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { postId } = req.params;

      const result = await postService.likePost(userId, postId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { postId } = req.params;

      const result = await postService.deletePost(userId, postId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const postController = new PostController();
