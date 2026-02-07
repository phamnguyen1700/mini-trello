import { BoardRepo } from '@/repos/board.repo';
import { AppError, ErrorCodes } from '@/utils/response';
import { CreateBoardDto, UpdateBoardDto } from '@shared/types';

export const BoardService = {
  async create(dto: CreateBoardDto, ownerId: string) {
    return BoardRepo.create(dto, ownerId);
  },

  async getAll(userId: string) {
    return BoardRepo.findAllByUserId(userId);
  },

  async getById(boardId: string, userId: string) {
    const board = await BoardRepo.findById(boardId);

    if (!board) {
      throw new AppError('Board not found', 404, ErrorCodes.NOT_FOUND);
    }

    if (!board.memberIds.includes(userId)) {
      throw new AppError('Not a member', 403, ErrorCodes.FORBIDDEN);
    }

    return board;
  },

  async update(boardId: string, dto: UpdateBoardDto, userId: string) {
    const board = await BoardRepo.findById(boardId);

    if (!board) {
      throw new AppError('Board not found', 404, ErrorCodes.NOT_FOUND);
    }

    if (board.ownerId !== userId) {
      throw new AppError('Only owner can update', 403, ErrorCodes.FORBIDDEN);
    }

    return BoardRepo.update(boardId, dto);
  },

  async delete(boardId: string, userId: string) {
    const board = await BoardRepo.findById(boardId);

    if (!board) {
      throw new AppError('Board not found', 404, ErrorCodes.NOT_FOUND);
    }

    if (board.ownerId !== userId) {
      throw new AppError('Only owner can delete', 403, ErrorCodes.FORBIDDEN);
    }

    return BoardRepo.delete(boardId);
  },
};
