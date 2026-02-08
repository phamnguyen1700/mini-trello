import { TaskService } from '@/services/task.service';
import { AppError, ErrorCodes, sendError, sendSuccess } from '@/utils/response';
import {
  CreateTaskDto,
  MoveTaskDto,
  TaskPriority,
  TaskStatus,
  UpdateTaskDto,
} from '@shared/types';
import { Request, Response } from 'express';

const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'completed'];

const isTaskStatus = (status: unknown): status is TaskStatus =>
  typeof status === 'string' &&
  TASK_STATUSES.includes(status as TaskStatus);

export const getTasksByCard = async (req: Request, res: Response) => {
  try {
    const { boardId, id } = req.params as { boardId: string; id: string };
    const tasks = await TaskService.getAllByCard(boardId, id, req.userId);
    return sendSuccess(res, tasks);
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

export const createTask = async (req: Request, res: Response) => {
  try {
    const { boardId, id } = req.params as { boardId: string; id: string };
    const { title, description, priority, deadline, status } =
      req.body as Partial<CreateTaskDto> & {
        status?: TaskStatus;
        priority?: CreateTaskDto['priority'];
      };

    if (!title) {
      return sendError(
        res,
        'Task title is required',
        400,
        ErrorCodes.INVALID_INPUT,
      );
    }

    if (status !== undefined && !isTaskStatus(status)) {
      return sendError(
        res,
        'Invalid task status',
        400,
        ErrorCodes.INVALID_INPUT,
      );
    }

    const task = await TaskService.create(
      boardId,
      id,
      { title, description, priority: priority as TaskPriority, deadline, status },
      req.userId,
    );
    return sendSuccess(res, task, 'Task created', 201);
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

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { boardId, id, taskId } = req.params as {
      boardId: string;
      id: string;
      taskId: string;
    };
    const task = await TaskService.getById(boardId, id, taskId, req.userId);
    return sendSuccess(res, task);
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

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { boardId, id, taskId } = req.params as {
      boardId: string;
      id: string;
      taskId: string;
    };
    const { title, description, priority, status, deadline } =
      req.body as UpdateTaskDto;

    if (status !== undefined && !isTaskStatus(status)) {
      return sendError(
        res,
        'Invalid task status',
        400,
        ErrorCodes.INVALID_INPUT,
      );
    }

    const task = await TaskService.update(
      boardId,
      id,
      taskId,
      { title, description, priority, status, deadline },
      req.userId,
    );
    return sendSuccess(res, task);
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

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { boardId, id, taskId } = req.params as {
      boardId: string;
      id: string;
      taskId: string;
    };
    await TaskService.delete(boardId, id, taskId, req.userId);
    return sendSuccess(res, null, 'Task deleted successfully');
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

export const assignTask = async (req: Request, res: Response) => {
  try {
    const { boardId, id, taskId } = req.params as {
      boardId: string;
      id: string;
      taskId: string;
    };
    const { memberId } = req.body as { memberId?: string };

    if (!memberId) {
      return sendError(
        res,
        'memberId is required',
        400,
        ErrorCodes.INVALID_INPUT,
      );
    }

    const task = await TaskService.assign(
      boardId,
      id,
      taskId,
      memberId,
      req.userId,
    );
    return sendSuccess(res, task, 'Task assigned', 201);
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

export const moveTask = async (req: Request, res: Response) => {
  try {
    const { boardId, id, taskId } = req.params as {
      boardId: string;
      id: string;
      taskId: string;
    };
    const { toCardId, index } = req.body as Partial<MoveTaskDto>;

    if (!toCardId) {
      return sendError(
        res,
        'toCardId is required',
        400,
        ErrorCodes.INVALID_INPUT,
      );
    }

    const parsedIndex = typeof index === 'number' ? index : Number(index);
    if (!Number.isInteger(parsedIndex) || parsedIndex < 0) {
      return sendError(
        res,
        'Invalid index: must be a non-negative integer',
        400,
        ErrorCodes.INVALID_INPUT,
      );
    }

    const task = await TaskService.moveTask(
      boardId,
      id,
      taskId,
      { toCardId, index: parsedIndex },
      req.userId,
    );
    return sendSuccess(res, task, 'Task moved');
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

