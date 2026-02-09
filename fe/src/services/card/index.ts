import { apiClient } from "@/lib/api/api-client";
import {
  ApiResponse,
  Card,
  CreateCardDto,
  MoveCardDto,
  UpdateCardDto,
} from "../../../../shared/types";

export const cardService = {
  getAllByBoard: async (boardId: string) => {
    const response = await apiClient.get<ApiResponse<Card[]>>(
      `/boards/${boardId}/cards`,
    );
    return response.data;
  },

  getById: async ({ boardId, id }: { boardId: string; id: string }) => {
    const response = await apiClient.get<ApiResponse<Card>>(
      `/boards/${boardId}/cards/${id}`,
    );
    return response.data;
  },

  getAllByBoardAndUser: async ({
    boardId,
    userId,
  }: {
    boardId: string;
    userId: string;
  }) => {
    const response = await apiClient.get<ApiResponse<Card[]>>(
      `/boards/${boardId}/cards/user/${userId}`,
    );
    return response.data;
  },

  create: async ({
    boardId,
    data,
  }: {
    boardId: string;
    data: CreateCardDto;
  }) => {
    const response = await apiClient.post<ApiResponse<Card>>(
      `/boards/${boardId}/cards`,
      data,
    );
    return response.data;
  },

  update: async ({
    boardId,
    id,
    data,
  }: {
    boardId: string;
    id: string;
    data: UpdateCardDto;
  }) => {
    const response = await apiClient.put<ApiResponse<Card>>(
      `/boards/${boardId}/cards/${id}`,
      data,
    );
    return response.data;
  },

  delete: async ({ boardId, id }: { boardId: string; id: string }) => {
    const response = await apiClient.delete<ApiResponse<null>>(
      `/boards/${boardId}/cards/${id}`,
    );
    return response.data;
  },

  move: async ({
    boardId,
    id,
    data,
  }: {
    boardId: string;
    id: string;
    data: MoveCardDto;
  }) => {
    const response = await apiClient.patch<ApiResponse<Card>>(
      `/boards/${boardId}/cards/${id}/move`,
      data,
    );
    return response.data;
  },
};

