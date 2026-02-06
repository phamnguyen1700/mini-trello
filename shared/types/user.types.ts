export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  githubId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SendCodeDto {
  email: string;
}

export interface VerifyCodeDto {
  email: string;
  verificationCode: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface UserAuthData {
  accessToken: string;
  user: User;
}

export type AuthResponse = ApiResponse<UserAuthData>;

export interface SendCodeData {
  isExistingUser: boolean;
}

export type SendCodeResponse = ApiResponse<SendCodeData>;
