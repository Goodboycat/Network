import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimit';

const router = Router();

// Public routes
router.post(
  '/register',
  authLimiter,
  authController.constructor.registerValidation,
  validate,
  authController.register.bind(authController)
);

router.post(
  '/login',
  authLimiter,
  authController.constructor.loginValidation,
  validate,
  authController.login.bind(authController)
);

router.post(
  '/refresh-token',
  authController.constructor.refreshTokenValidation,
  validate,
  authController.refreshToken.bind(authController)
);

router.get(
  '/verify-email/:token',
  authController.verifyEmail.bind(authController)
);

router.post(
  '/password-reset/request',
  authLimiter,
  authController.requestPasswordReset.bind(authController)
);

router.post(
  '/password-reset',
  authLimiter,
  authController.constructor.resetPasswordValidation,
  validate,
  authController.resetPassword.bind(authController)
);

// Protected routes
router.post(
  '/logout',
  authenticateToken,
  authController.logout.bind(authController)
);

router.post(
  '/logout-all',
  authenticateToken,
  authController.logoutAll.bind(authController)
);

router.get(
  '/me',
  authenticateToken,
  authController.getMe.bind(authController)
);

export default router;
