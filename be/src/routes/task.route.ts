import {
  assignTask,
  createTask,
  deleteTask,
  getTaskById,
  getTasksByCard,
  moveTask,
  updateTask,
} from '@/controllers/task.controller';
import { authMiddleware } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

router.use(authMiddleware);

router.get('/boards/:boardId/cards/:id/tasks', getTasksByCard);
router.post('/boards/:boardId/cards/:id/tasks', createTask);
router.get('/boards/:boardId/cards/:id/tasks/:taskId', getTaskById);
router.put('/boards/:boardId/cards/:id/tasks/:taskId', updateTask);
router.delete('/boards/:boardId/cards/:id/tasks/:taskId', deleteTask);
router.post('/boards/:boardId/cards/:id/tasks/:taskId/assign', assignTask);
router.patch('/boards/:boardId/cards/:id/tasks/:taskId/move', moveTask);

export default router;

