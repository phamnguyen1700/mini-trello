import { AuthService } from '@/services/auth.service';
import { ErrorCodes, sendError, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, verificationCode } = req.body;

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
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const errorCode = error.code || ErrorCodes.SERVER_ERROR;
    return sendError(res, error.message, statusCode, errorCode);
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, verificationCode } = req.body;

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
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    const errorCode = error.code || ErrorCodes.SERVER_ERROR;
    return sendError(res, error.message, statusCode, errorCode);
  }
};
