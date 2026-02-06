import { apiClient } from "@/lib/api/api-client";
import { AuthResponse } from "../../../../../shared/types/user.types";

export const githubService = {
  exchangeCode: async (code: string) => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/github/exchange",
      { code },
    );
    return response.data;
  },
};
