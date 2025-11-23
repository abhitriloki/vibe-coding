import express from 'express';
import { chat, testConnection } from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', protect, chat);
router.post('/test', protect, testConnection);

export default router;
