import { Router } from 'express';

import { authMiddleware } from '../middleware/auth';
import authRoutes from './auth.route';

const router = Router();

router.use('/auth', authRoutes);

export default router;
