import { apiClient } from "@/services/api-client";

import type {
  ApiMessageResponse,
  AuthUserResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  VerifyResetOtpRequest,
} from "@/features/auth/types/auth.types";

const AUTH_BASE_PATH = "/auth";

export const registerUser = async (
  input: RegisterRequest,
): Promise<AuthUserResponse> => {
  const formData = new FormData();

  formData.append("fullName", input.fullName);

  formData.append("username", input.username);

  formData.append("email", input.email);

  formData.append("phoneNumber", input.phoneNumber);

  formData.append("city", input.city);

  formData.append("gender", input.gender);

  formData.append("password", input.password);

  formData.append("confirmPassword", input.confirmPassword);

  formData.append("profileImage", input.profileImage);

  const response = await apiClient.post<AuthUserResponse>(
    `${AUTH_BASE_PATH}/register`,
    formData,
  );

  return response.data;
};

export const loginUser = async (
  input: LoginRequest,
): Promise<AuthUserResponse> => {
  const response = await apiClient.post<AuthUserResponse>(
    `${AUTH_BASE_PATH}/login`,
    input,
  );

  return response.data;
};

export const getCurrentUser = async (): Promise<AuthUserResponse> => {
  const response = await apiClient.get<AuthUserResponse>(
    `${AUTH_BASE_PATH}/me`,
  );

  return response.data;
};

export const logoutUser = async (): Promise<ApiMessageResponse> => {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_BASE_PATH}/logout`,
  );

  return response.data;
};

export const requestPasswordReset = async (
  input: ForgotPasswordRequest,
): Promise<ApiMessageResponse> => {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_BASE_PATH}/forgot-password`,
    input,
  );

  return response.data;
};

export const verifyResetOtp = async (
  input: VerifyResetOtpRequest,
): Promise<ApiMessageResponse> => {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_BASE_PATH}/verify-reset-otp`,
    input,
  );

  return response.data;
};

export const resetUserPassword = async (
  input: ResetPasswordRequest,
): Promise<ApiMessageResponse> => {
  const response = await apiClient.post<ApiMessageResponse>(
    `${AUTH_BASE_PATH}/reset-password`,
    input,
  );

  return response.data;
};
