import { BoardRepo } from '@/repos/board.repo';
import { CardRepo } from '@/repos/card.repo';
import { TaskRepo } from '@/repos/task.repo';
import { AppError, ErrorCodes } from '@/utils/response';
import {
  CreateTaskDto,
  MoveTaskDto,
  Task,
  TaskStatus,
  UpdateTaskDto,
} from '@shared/types';
import { Timestamp } from 'firebase-admin/firestore';

type CreateTaskInput = Partial<CreateTaskDto> & {
  title: string;
  status?: TaskStatus;
};

export const TaskService = {
  getNewPosition(items: Task[], index: number): number {
    if (items.length === 0) return 1;
    const clampedIndex = Math.min(index, items.length);
    if (clampedIndex === 0) {
      return items[0].position / 2;
    }
    if (clampedIndex < items.length) {
      const prev = items[clampedIndex - 1];
      const next = items[clampedIndex];
      return (prev.position + next.position) / 2;
    }
    return items[items.length - 1].position + 1;
  },
  async getAllByCard(boardId: string, cardId: string, userId: string) {
    const board = await BoardRepo.findById(boardId);
    if (!board) {
      throw new AppError('Board not found', 404, ErrorCodes.NOT_FOUND);
    }
    if (!board.memberIds.includes(userId)) {
      throw new AppError('Not a board member', 403, ErrorCodes.FORBIDDEN);
    }

    const card = await CardRepo.findById(cardId);
    if (!card || card.boardId !== boardId) {
      throw new AppError('Card not found', 404, ErrorCodes.NOT_FOUND);
    }

    const tasks = await TaskRepo.findAllByCard(cardId);
    return tasks.sort((a, b) => a.position - b.position);
  },

  async getById(
    boardId: string,
    cardId: string,
    taskId: string,
    userId: string,
  ): Promise<Task> {
    const board = await BoardRepo.findById(boardId);
    if (!board) {
      throw new AppError('Board not found', 404, ErrorCodes.NOT_FOUND);
    }
    if (!board.memberIds.includes(userId)) {
      throw new AppError('Not a board member', 403, ErrorCodes.FORBIDDEN);
    }

    const card = await CardRepo.findById(cardId);
    if (!card || card.boardId !== boardId) {
      throw new AppError('Card not found', 404, ErrorCodes.NOT_FOUND);
    }

    const task = await TaskRepo.findById(taskId);
    if (!task || task.cardId !== cardId) {
      throw new AppError('Task not found', 404, ErrorCodes.NOT_FOUND);
    }

    return task;
  },

  async create(
    boardId: string,
    cardId: string,
    dto: CreateTaskInput,
    userId: string,
  ) {
    const board = await BoardRepo.findById(boardId);
    if (!board) {
      throw new AppError('Board not found', 404, ErrorCodes.NOT_FOUND);
    }
    if (!board.memberIds.includes(userId)) {
      throw new AppError('Not a board member', 403, ErrorCodes.FORBIDDEN);
    }

    const card = await CardRepo.findById(cardId);
    if (!card || card.boardId !== boardId) {
      throw new AppError('Card not found', 404, ErrorCodes.NOT_FOUND);
    }

    const existing = await TaskRepo.findAllByCard(cardId);
    const maxPosition = existing.reduce(
      (max, task) => Math.max(max, task.position),
      0,
    );

    const taskData = {
      cardId,
      title: dto.title,
      priority: dto.priority ?? 'medium',
      status: dto.status ?? 'todo',
      position: maxPosition + 1,
      createdBy: userId,
    } as const;

    const task = await TaskRepo.create({
      ...taskData,
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.deadline !== undefined && {
        deadline: Timestamp.fromDate(dto.deadline),
      }),
    });

    await CardRepo.adjustTasksCount(cardId, 1);
    return task;
  },

  async update(
    boardId: string,
    cardId: string,
    taskId: string,
    dto: UpdateTaskDto,
    userId: string,
  ) {
    await this.getById(boardId, cardId, taskId, userId);
    return TaskRepo.update(taskId, dto);
  },

  async delete(
    boardId: string,
    cardId: string,
    taskId: string,
    userId: string,
  ) {
    await this.getById(boardId, cardId, taskId, userId);
    await TaskRepo.delete(taskId);
    await CardRepo.adjustTasksCount(cardId, -1);
  },

  async assign(
    boardId: string,
    cardId: string,
    taskId: string,
    memberId: string,
    userId: string,
  ) {
    const board = await BoardRepo.findById(boardId);
    if (!board) {
      throw new AppError('Board not found', 404, ErrorCodes.NOT_FOUND);
    }
    if (!board.memberIds.includes(userId)) {
      throw new AppError('Not a board member', 403, ErrorCodes.FORBIDDEN);
    }
    if (!board.memberIds.includes(memberId)) {
      throw new AppError('Member not in board', 400, ErrorCodes.INVALID_INPUT);
    }

    await this.getById(boardId, cardId, taskId, userId);
    return TaskRepo.assign(taskId, memberId);
  },

  async moveTask(
    boardId: string,
    cardId: string,
    taskId: string,
    dto: MoveTaskDto,
    userId: string,
  ) {
    const board = await BoardRepo.findById(boardId);
    if (!board) {
      throw new AppError('Board not found', 404, ErrorCodes.NOT_FOUND);
    }
    if (!board.memberIds.includes(userId)) {
      throw new AppError('Not a board member', 403, ErrorCodes.FORBIDDEN);
    }

    const sourceCard = await CardRepo.findById(cardId);
    if (!sourceCard || sourceCard.boardId !== boardId) {
      throw new AppError('Card not found', 404, ErrorCodes.NOT_FOUND);
    }

    const targetCard = await CardRepo.findById(dto.toCardId);
    if (!targetCard || targetCard.boardId !== boardId) {
      throw new AppError('Target card not found', 404, ErrorCodes.NOT_FOUND);
    }

    const task = await TaskRepo.findById(taskId);
    if (!task || task.cardId !== cardId) {
      throw new AppError('Task not found', 404, ErrorCodes.NOT_FOUND);
    }

    const targetTasks = await TaskRepo.findAllByCard(dto.toCardId);
    const filtered = targetTasks
      .filter((t) => t.id !== taskId)
      .sort((a, b) => a.position - b.position);

    const newPosition = this.getNewPosition(filtered, dto.index);

    const moved = await TaskRepo.move(taskId, {
      cardId: dto.toCardId,
      position: newPosition,
    });

    if (dto.toCardId !== cardId) {
      await CardRepo.adjustTasksCount(cardId, -1);
      await CardRepo.adjustTasksCount(dto.toCardId, 1);
    }

    return moved;
  },
};

