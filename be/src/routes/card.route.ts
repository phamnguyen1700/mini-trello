import {
  createCard,
  deleteCard,
  getCardById,
  getCardsByBoard,
  getCardsByBoardAndUser,
  moveCard,
  updateCard,
} from '@/controllers/card.controller';
import { authMiddleware } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

router.use(authMiddleware);

router.post('/boards/:boardId/cards', createCard);
router.get('/boards/:boardId/cards', getCardsByBoard);
router.get('/boards/:boardId/cards/user/:userId', getCardsByBoardAndUser);
router.get('/boards/:boardId/cards/:id', getCardById);
router.put('/boards/:boardId/cards/:id', updateCard);
router.delete('/boards/:boardId/cards/:id', deleteCard);
router.patch('/boards/:boardId/cards/:id/move', moveCard);

export default router;

