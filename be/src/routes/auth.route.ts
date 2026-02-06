import { signin, signup } from '@/controllers/auth.controller';
import {
  githubCallback,
  githubExchange,
  githubStart,
} from '@/controllers/github.controller';
import { Router } from 'express';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);

router.get('/github', githubStart);
router.get('/github/callback', githubCallback);
router.post('/github/exchange', githubExchange);

export default router;
