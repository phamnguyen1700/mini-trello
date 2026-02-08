import { BoardRepo } from '@/repos/board.repo';
import { CardRepo } from '@/repos/card.repo';
import { AppError, ErrorCodes } from '@/utils/response';
import { Card, CreateCardDto, MoveCardDto, UpdateCardDto } from '@shared/types';

export const CardService = {
  // --------------------
  // CREATE CARD
  // --------------------
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

  // --------------------
  // GET ALL CARDS BY BOARD
  // --------------------
  async getAllByBoard(boardId: string, userId: string) {
    const board = await BoardRepo.findById(boardId);

    if (!board) {
      throw new AppError('Board not found', 404, ErrorCodes.NOT_FOUND);
    }

    if (!board.memberIds.includes(userId)) {
      throw new AppError('Not a board member', 403, ErrorCodes.FORBIDDEN);
    }

    return CardRepo.findAllByBoard(boardId);
  },

  // --------------------
  // GET CARD DETAIL
  // --------------------
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

  // --------------------
  // GET CARDS BY USER
  // --------------------
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

  // --------------------
  // UPDATE CARD
  // --------------------
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

  // --------------------
  // DELETE CARD
  // --------------------
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

  // --------------------
  // MOVE CARD (DRAG & DROP – FRACTIONAL POSITION)
  // --------------------
  async moveCard(cardId: string, dto: MoveCardDto, userId: string) {
    const card = await CardRepo.findById(cardId);
    if (!card) throw new AppError('Card not found', 403, ErrorCodes.FORBIDDEN);

    const board = await BoardRepo.findById(card.boardId);
    if (!board || !board.memberIds.includes(userId)) {
      throw new AppError('Not a board member', 403, ErrorCodes.FORBIDDEN);
    }

    const cards: Card[] = await CardRepo.findAllByBoard(card.boardId);

    const sameStatusCards: Card[] = cards
      .filter((c): c is Card => c.status === dto.status && c.id !== cardId)
      .sort((a, b) => a.position - b.position);

    if (sameStatusCards.length === 0) {
      return CardRepo.move(cardId, {
        status: dto.status,
        position: 1,
      });
    }

    const prev = sameStatusCards[dto.position - 1];
    const next = sameStatusCards[dto.position];

    let newPosition: number;

    if (!prev && next) {
      newPosition = next.position / 2;
    } else if (prev && next) {
      newPosition = (prev.position + next.position) / 2;
    } else if (prev) {
      newPosition = prev.position + 1;
    } else {
      newPosition = 1;
    }

    return CardRepo.move(cardId, {
      status: dto.status,
      position: newPosition,
    });
  },
};
