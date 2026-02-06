import { NextFunction, Request, Response } from 'express';

import { verifyToken } from '../common/utils/jwt';
import { ErrorCodes, sendError } from '../utils/response';

declare global {
  namespace Express {
    interface Request {
      userId: string;
      email: string;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'No token provided', 401, ErrorCodes.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.email = decoded.email;
    next();
  } catch (err) {
    console.error('[Auth Middleware] Token verification failed:', err);
    return sendError(
      res,
      'Invalid or expired token',
      401,
      ErrorCodes.INVALID_TOKEN,
    );
  }
};
