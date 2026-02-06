import { getMe } from '@/controllers/user.controller';
import { authMiddleware } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

router.get('/me', authMiddleware, getMe);

export default router;
