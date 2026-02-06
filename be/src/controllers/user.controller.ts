import { UserService } from '@/services/user.service';
import { AppError, ErrorCodes, sendError, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return sendError(res, 'Unauthorized', 401, ErrorCodes.UNAUTHORIZED);
    }

    const user = await UserService.getMe(userId);
    return sendSuccess(res, user, 'User retrieved');
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode, error.code);
    }
    return sendError(
      res,
      'Internal server error',
      500,
      ErrorCodes.SERVER_ERROR,
    );
  }
};
