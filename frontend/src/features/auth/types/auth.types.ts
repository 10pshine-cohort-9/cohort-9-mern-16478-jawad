export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

export interface PublicUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  city: string;
  gender: Gender;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
}

export interface ApiMessageResponse {
  success: boolean;
  message: string;
}

export interface AuthUserData {
  user: PublicUser;
}

export type AuthUserResponse = ApiResponse<AuthUserData>;

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  city: string;
  gender: Gender;
  password: string;
  confirmPassword: string;
  profileImage: File;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}

export interface ApiFieldError {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  code?: string;
  errors?: ApiFieldError[];
}
