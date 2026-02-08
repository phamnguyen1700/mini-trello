import { BoardRepo } from '@/repos/board.repo';
import { CardRepo } from '@/repos/card.repo';
import { AppError, ErrorCodes } from '@/utils/response';
import { Card, CreateCardDto, MoveCardDto, UpdateCardDto } from '@shared/types';

export const CardService = {
  async create(boardId: string, dto: CreateCardDto, userId: string) {
    const board = await BoardRepo.findById(boardId);

    if (!board) {
      throw new AppError('Board not found', 404, ErrorCodes.NOT_FOUND);
    }

    if (!board.memberIds.includes(userId)) {
      throw new AppError('Not a board member', 403, ErrorCodes.FORBIDDEN);
    }

    return CardRepo.create(boardId, dto, userId);
  },

  async getAllByBoard(boardId: string, userId: string) {
    const board = await BoardRepo.findById(boardId);

    if (!board) {
      throw new AppError('Board not found', 404, ErrorCodes.NOT_FOUND);
    }

    if (!board.memberIds.includes(userId)) {
      throw new AppError('Not a board member', 403, ErrorCodes.FORBIDDEN);
    }

    const cards = await CardRepo.findAllByBoard(boardId);
    return cards.sort((a, b) => a.position - b.position);
  },

  async getById(cardId: string, userId: string) {
    const card = await CardRepo.findById(cardId);

    if (!card) {
      throw new AppError('Card not found', 404, ErrorCodes.NOT_FOUND);
    }

    const board = await BoardRepo.findById(card.boardId);
    if (!board || !board.memberIds.includes(userId)) {
      throw new AppError('Not a board member', 403, ErrorCodes.FORBIDDEN);
    }

    return card;
  },

  async getByBoardAndUser(
    boardId: string,
    targetUserId: string,
    userId: string,
  ) {
    const board = await BoardRepo.findById(boardId);

    if (!board) {
      throw new AppError('Board not found', 404, ErrorCodes.NOT_FOUND);
    }

    if (!board.memberIds.includes(userId)) {
      throw new AppError('Not a board member', 403, ErrorCodes.FORBIDDEN);
    }

    return CardRepo.findByBoardAndUser(boardId, targetUserId);
  },

  async update(cardId: string, dto: UpdateCardDto, userId: string) {
    const card = await CardRepo.findById(cardId);

    if (!card) {
      throw new AppError('Card not found', 404, ErrorCodes.NOT_FOUND);
    }

    const board = await BoardRepo.findById(card.boardId);
    if (!board || !board.memberIds.includes(userId)) {
      throw new AppError('Not a board member', 403, ErrorCodes.FORBIDDEN);
    }

    return CardRepo.update(cardId, dto);
  },

  async delete(cardId: string, userId: string) {
    const card = await CardRepo.findById(cardId);

    if (!card) {
      throw new AppError('Card not found', 404, ErrorCodes.NOT_FOUND);
    }

    const board = await BoardRepo.findById(card.boardId);
    if (!board || !board.memberIds.includes(userId)) {
      throw new AppError('Not a board member', 403, ErrorCodes.FORBIDDEN);
    }

    await CardRepo.delete(cardId);
  },

  async moveCard(cardId: string, dto: MoveCardDto, userId: string) {
    const card = await CardRepo.findById(cardId);
    if (!card) {
      throw new AppError('Card not found', 404, ErrorCodes.NOT_FOUND);
    }

    const board = await BoardRepo.findById(card.boardId);
    if (!board || !board.memberIds.includes(userId)) {
      throw new AppError('Not a board member', 403, ErrorCodes.FORBIDDEN);
    }

    const index: number = dto.index;
    if (!Number.isInteger(index) || index < 0) {
      throw new AppError(
        'Invalid index: must be a non-negative integer',
        400,
        ErrorCodes.INVALID_INPUT,
      );
    }

    const cards: Card[] = await CardRepo.findAllByBoard(card.boardId);
    const targetStatus = dto.status ?? card.status;

    const boardCards: Card[] = cards
      .filter((c): c is Card => c.id !== cardId)
      .sort((a, b) => a.position - b.position);

    if (boardCards.length === 0) {
      return CardRepo.move(cardId, {
        status: targetStatus,
        position: 1,
      });
    }

    const clampedIndex: number = Math.min(index, boardCards.length);

    let newPosition: number;

    const fallback = { status: targetStatus, position: 1 };

    if (clampedIndex === 0) {
      const firstCard = boardCards[0];
      if (!firstCard) return CardRepo.move(cardId, fallback);
      newPosition = firstCard.position / 2;
    } else if (clampedIndex < boardCards.length) {
      const prevCard = boardCards[clampedIndex - 1];
      const nextCard = boardCards[clampedIndex];
      if (!prevCard || !nextCard) return CardRepo.move(cardId, fallback);
      newPosition = (prevCard.position + nextCard.position) / 2;
    } else {
      const lastCard = boardCards[boardCards.length - 1];
      if (!lastCard) return CardRepo.move(cardId, fallback);
      newPosition = lastCard.position + 1;
    }

    return CardRepo.move(cardId, {
      status: targetStatus,
      position: newPosition,
    });
  },
};
