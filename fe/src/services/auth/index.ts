import { apiClient } from "@/lib/api/api-client";
import {
  SendCodeDto,
  VerifyCodeDto,
  AuthResponse,
  User,
  SendCodeResponse,
} from "../../../../shared/types/user.types";

export const authService = {
  sendSignupCode: async (data: SendCodeDto) => {
    const response = await apiClient.post<SendCodeResponse>(
      "/auth/signup",
      data,
    );
    return response.data;
  },

  verifySignup: async (data: VerifyCodeDto) => {
    const response = await apiClient.post<User>("/auth/signup", data);
    return response.data;
  },

  sendSigninCode: async (data: SendCodeDto) => {
    const response = await apiClient.post<SendCodeResponse>(
      "/auth/signin",
      data,
    );
    return response.data;
  },

  verifySignin: async (data: VerifyCodeDto) => {
    const response = await apiClient.post<AuthResponse>("/auth/signin", data);
    return response.data;
  },
};
