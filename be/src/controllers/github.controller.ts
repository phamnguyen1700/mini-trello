import { GitHubService } from '@/services/github.service';
import { AppError, ErrorCodes, sendError, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';

export const githubStart = (_req: Request, res: Response) => {
  try {
    const authUrl = GitHubService.getAuthUrl();
    return res.redirect(authUrl);
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

export const githubCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return sendError(
        res,
        'GitHub code is required',
        400,
        ErrorCodes.INVALID_INPUT,
      );
    }

    const tempCode = await GitHubService.authenticate(code);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/auth/github?code=${tempCode}`);
  } catch (error: unknown) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(`${frontendUrl}/auth?error=github_auth_failed`);
  }
};

export const githubExchange = async (req: Request, res: Response) => {
  try {
    const { code } = req.body as { code?: string };

    if (!code) {
      return sendError(res, 'Code is required', 400, ErrorCodes.INVALID_INPUT);
    }

    const result = await GitHubService.exchangeTempCode(code);
    return sendSuccess(res, result, 'Login successful');
  } catch (error: unknown) {
    if (error instanceof AppError) {
      return sendError(res, error.message, error.statusCode, error.code);
    }
    return sendError(res, 'Exchange failed', 401, ErrorCodes.UNAUTHORIZED);
  }
};
