import { CardService } from '@/services/card.service';
import { AppError, ErrorCodes, sendError, sendSuccess } from '@/utils/response';
import { CardStatus, MoveCardDto } from '@shared/types';
import { Request, Response } from 'express';

const CARD_STATUSES: CardStatus[] = [
  'icebox',
  'backlog',
  'ongoing',
  'review',
  'done',
];

const isCardStatus = (status: unknown): status is CardStatus =>
  typeof status === 'string' &&
  CARD_STATUSES.includes(status as CardStatus);

const parseNonNegativeIndex = (value: unknown): number | null => {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(num) || num < 0) return null;
  return num;
};

export const createCard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params as { boardId: string };
    const { name, description } = req.body as {
      name?: string;
      description?: string;
    };

    if (!name) {
      return sendError(
        res,
        'Card name is required',
        400,
        ErrorCodes.INVALID_INPUT,
      );
    }

    const card = await CardService.create(
      boardId,
      { name, description },
      req.userId,
    );
    return sendSuccess(res, card, 'Card created', 201);
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

export const getCardsByBoard = async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params as { boardId: string };
    const cards = await CardService.getAllByBoard(boardId, req.userId);
    return sendSuccess(res, cards);
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

export const getCardById = async (req: Request, res: Response) => {
  try {
    const { boardId, id } = req.params as { boardId: string; id: string };
    const card = await CardService.getById(id, req.userId);
    if (card.boardId !== boardId) {
      return sendError(res, 'Card not found', 404, ErrorCodes.NOT_FOUND);
    }
    return sendSuccess(res, card);
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

export const getCardsByBoardAndUser = async (req: Request, res: Response) => {
  try {
    const { boardId, userId } = req.params as {
      boardId: string;
      userId: string;
    };
    const cards = await CardService.getByBoardAndUser(
      boardId,
      userId,
      req.userId,
    );
    return sendSuccess(res, cards);
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

export const updateCard = async (req: Request, res: Response) => {
  try {
    const { boardId, id } = req.params as { boardId: string; id: string };
    const { name, description } = req.body as {
      name?: string;
      description?: string;
    };

    const existingCard = await CardService.getById(id, req.userId);
    if (existingCard.boardId !== boardId) {
      return sendError(res, 'Card not found', 404, ErrorCodes.NOT_FOUND);
    }

    const card = await CardService.update(
      id,
      { name, description },
      req.userId,
    );
    return sendSuccess(res, card);
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

export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { boardId, id } = req.params as { boardId: string; id: string };
    const existingCard = await CardService.getById(id, req.userId);
    if (existingCard.boardId !== boardId) {
      return sendError(res, 'Card not found', 404, ErrorCodes.NOT_FOUND);
    }
    await CardService.delete(id, req.userId);
    return sendSuccess(res, null, 'Card deleted successfully');
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

export const moveCard = async (req: Request, res: Response) => {
  try {
    const { boardId, id } = req.params as { boardId: string; id: string };
    const { status, index } = req.body as Partial<MoveCardDto>;

    if (status !== undefined && !isCardStatus(status)) {
      return sendError(
        res,
        'Invalid status',
        400,
        ErrorCodes.INVALID_INPUT,
      );
    }

    const parsedIndex = parseNonNegativeIndex(index);
    if (parsedIndex === null) {
      return sendError(
        res,
        'Invalid index: must be a non-negative integer',
        400,
        ErrorCodes.INVALID_INPUT,
      );
    }

    const existingCard = await CardService.getById(id, req.userId);
    if (existingCard.boardId !== boardId) {
      return sendError(res, 'Card not found', 404, ErrorCodes.NOT_FOUND);
    }

    const card = await CardService.moveCard(
      id,
      { status, index: parsedIndex },
      req.userId,
    );
    return sendSuccess(res, card, 'Card moved');
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

