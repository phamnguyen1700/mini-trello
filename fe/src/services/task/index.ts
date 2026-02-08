import { apiClient } from "@/lib/api/api-client";
import {
  ApiResponse,
  AssignTaskDto,
  CreateTaskDto,
  MoveTaskDto,
  Task,
  UpdateTaskDto,
} from "../../../../shared/types";

export const taskService = {
  getAllByCard: async ({
    boardId,
    cardId,
  }: {
    boardId: string;
    cardId: string;
  }) => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/boards/${boardId}/cards/${cardId}/tasks`,
    );
    return response.data;
  },

  getById: async ({
    boardId,
    cardId,
    taskId,
  }: {
    boardId: string;
    cardId: string;
    taskId: string;
  }) => {
    const response = await apiClient.get<ApiResponse<Task>>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}`,
    );
    return response.data;
  },

  create: async ({
    boardId,
    cardId,
    data,
  }: {
    boardId: string;
    cardId: string;
    data: CreateTaskDto;
  }) => {
    const response = await apiClient.post<ApiResponse<Task>>(
      `/boards/${boardId}/cards/${cardId}/tasks`,
      data,
    );
    return response.data;
  },

  update: async ({
    boardId,
    cardId,
    taskId,
    data,
  }: {
    boardId: string;
    cardId: string;
    taskId: string;
    data: UpdateTaskDto;
  }) => {
    const response = await apiClient.put<ApiResponse<Task>>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}`,
      data,
    );
    return response.data;
  },

  delete: async ({
    boardId,
    cardId,
    taskId,
  }: {
    boardId: string;
    cardId: string;
    taskId: string;
  }) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}`,
    );
    return response.data;
  },

  assign: async ({
    boardId,
    cardId,
    taskId,
    data,
  }: {
    boardId: string;
    cardId: string;
    taskId: string;
    data: AssignTaskDto;
  }) => {
    const response = await apiClient.post<ApiResponse<Task>>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`,
      data,
    );
    return response.data;
  },
 
  move: async ({
    boardId,
    cardId,
    taskId,
    data,
  }: {
    boardId: string;
    cardId: string;
    taskId: string;
    data: MoveTaskDto;
  }) => {
    const response = await apiClient.patch<ApiResponse<Task>>(
      `/boards/${boardId}/cards/${cardId}/tasks/${taskId}/move`,
      data,
    );
    return response.data;
  },
};

