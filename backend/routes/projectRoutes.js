import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addChatMessage,
  shareProject,
  getSharedProject
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.post('/:id/chat', protect, addChatMessage);
router.post('/:id/share', protect, shareProject);
router.get('/shared/:token', getSharedProject);

export default router;
