import { BoardService } from '@/services/board.service';
import { AppError, ErrorCodes, sendError, sendSuccess } from '@/utils/response';
import { Request, Response } from 'express';

export const createBoard = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body as {
      name?: string;
      description?: string;
    };

    if (!name) {
      return sendError(
        res,
        'Board name is required',
        400,
        ErrorCodes.INVALID_INPUT,
      );
    }

    const board = await BoardService.create({ name, description }, req.userId);
    return sendSuccess(res, board, 'Board created', 201);
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

export const getAllBoards = async (req: Request, res: Response) => {
  try {
    const boards = await BoardService.getAll(req.userId);
    return sendSuccess(res, boards);
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

export const getBoardById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const board = await BoardService.getById(id, req.userId);
    return sendSuccess(res, board);
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

export const updateBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const { name, description } = req.body as {
      name?: string;
      description?: string;
    };

    const board = await BoardService.update(
      id,
      { name, description },
      req.userId,
    );
    return sendSuccess(res, board);
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

export const deleteBoard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    await BoardService.delete(id, req.userId);
    return sendSuccess(res, null, 'Board deleted successfully');
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
