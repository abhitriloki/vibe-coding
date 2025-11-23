import express from 'express';
import { downloadProject } from '../controllers/downloadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', protect, downloadProject);

export default router;
