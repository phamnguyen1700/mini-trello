import {
  createBoard,
  deleteBoard,
  getAllBoards,
  getBoardById,
  updateBoard,
} from '@/controllers/board.controller';
import { authMiddleware } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

router.use(authMiddleware);

router.post('/', createBoard);
router.get('/', getAllBoards);
router.get('/:id', getBoardById);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);

export default router;
