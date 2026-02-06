import { AuthService } from '@/services/auth.service';
import { AppError, ErrorCodes, sendError, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, verificationCode } = req.body as {
      email?: string;
      verificationCode?: string;
    };

    if (!email) {
      return sendError(res, 'Email is required', 400, ErrorCodes.INVALID_INPUT);
    }

    if (!verificationCode) {
      const result = await AuthService.sendSignupCode(email);
      const message = result.isExistingUser
        ? 'User exists. Verification code sent for sign in.'
        : 'Verification code sent';
      return sendSuccess(
        res,
        { isExistingUser: result.isExistingUser },
        message,
      );
    }

    const result = await AuthService.signup(email, verificationCode);
    return sendSuccess(res, result, 'User created', 201);
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

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, verificationCode } = req.body as {
      email?: string;
      verificationCode?: string;
    };

    if (!email) {
      return sendError(res, 'Email is required', 400, ErrorCodes.INVALID_INPUT);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(
        res,
        'Invalid email format',
        400,
        ErrorCodes.INVALID_INPUT,
      );
    }

    if (!verificationCode) {
      await AuthService.sendSigninCode(email);
      return sendSuccess(res, null, 'Verification code sent');
    }

    const result = await AuthService.signin(email, verificationCode);
    return sendSuccess(res, result, 'Login successful');
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
