import express from 'express';
import {
  register,
  login,
  getMe,
  updateApiKeys,
  getApiKeys,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/api-keys', protect, updateApiKeys);
router.get('/api-keys', protect, getApiKeys);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

export default router;
