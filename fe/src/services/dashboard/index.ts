import { apiClient } from "@/lib/api/api-client";
import {
  Board,
  CreateBoardDto,
  UpdateBoardDto,
  ApiResponse,
} from "../../../../shared/types";

export const boardService = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Board[]>>("/boards");
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Board>>(`/boards/${id}`);
    return response.data;
  },

  create: async (data: CreateBoardDto) => {
    const response = await apiClient.post<ApiResponse<Board>>("/boards", data);
    return response.data;
  },

  update: async ({ id, data }: { id: string; data: UpdateBoardDto }) => {
    const response = await apiClient.put<ApiResponse<Board>>(
      `/boards/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<null>>(`/boards/${id}`);
    return response.data;
  },
};
