import { Response, NextFunction } from 'express';
import { body, param, query } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { userService } from '../services/user.service';

export class UserController {
  // Validation rules
  static getUserValidation = [param('userId').isString().notEmpty()];

  static updateProfileValidation = [
    body('displayName').optional().isString().trim().isLength({ min: 1, max: 50 }),
    body('bio').optional().isString().trim().isLength({ max: 500 }),
    body('location').optional().isString().trim().isLength({ max: 100 }),
    body('website').optional().isURL(),
    body('birthDate').optional().isISO8601(),
  ];

  static searchUsersValidation = [
    query('query').isString().notEmpty().isLength({ min: 1, max: 100 }),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  ];

  async getUserById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user?.id;

      const user = await userService.getUserById(userId, currentUserId);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserByUsername(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      const currentUserId = req.user?.id;

      const user = await userService.getUserByUsername(username, currentUserId);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await userService.updateProfile(userId, req.body);

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const settings = await userService.updateSettings(userId, req.body);

      res.json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  async followUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const followerId = req.user!.id;
      const { userId } = req.params;

      const result = await userService.followUser(followerId, userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async unfollowUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const followerId = req.user!.id;
      const { userId } = req.params;

      const result = await userService.unfollowUser(followerId, userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFollowers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await userService.getFollowers(userId, page, limit);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFollowing(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await userService.getFollowing(userId, page, limit);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async searchUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const query = req.query.query as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await userService.searchUsers(query, page, limit);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
