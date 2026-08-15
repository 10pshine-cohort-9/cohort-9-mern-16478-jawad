import type { RequestHandler } from "express";

import { AppError } from "../../common/errors/app-error.js";
import {
  clearAuthCookie,
  clearPasswordResetCookie,
  getPasswordResetCookie,
  setAuthCookie,
  setPasswordResetCookie,
} from "../../common/utils/auth-cookie.js";
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyResetOtpInput,
} from "./auth.schema.js";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  requestPasswordReset,
  resetUserPassword,
  verifyPasswordResetOtp,
} from "./auth.service.js";

type AuthBodyRequestHandler<TBody> = RequestHandler<
  Record<string, never>,
  unknown,
  TBody
>;

export const register: AuthBodyRequestHandler<RegisterInput> = async (
  request,
  response,
  next,
) => {
  try {
    if (!request.file) {
      throw new AppError("Profile image is required", 400, {
        code: "PROFILE_IMAGE_REQUIRED",
      });
    }

    const user = await registerUser(request.body, request.file);

    response.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login: AuthBodyRequestHandler<LoginInput> = async (
  request,
  response,
  next,
) => {
  try {
    const result = await loginUser(request.body);

    setAuthCookie(response, result.accessToken);

    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Pragma", "no-cache");

    response.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword: AuthBodyRequestHandler<
  ForgotPasswordInput
> = async (request, response, next) => {
  try {
    await requestPasswordReset(request.body);

    response.status(200).json({
      success: true,
      message:
        "If an account exists for this email, a password reset code has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyResetOtp: AuthBodyRequestHandler<
  VerifyResetOtpInput
> = async (request, response, next) => {
  try {
    const resetToken = await verifyPasswordResetOtp(request.body);

    setPasswordResetCookie(response, resetToken);

    response.setHeader("Cache-Control", "no-store");

    response.status(200).json({
      success: true,
      message: "Verification code confirmed. You can now reset your password.",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword: AuthBodyRequestHandler<ResetPasswordInput> = async (
  request,
  response,
  next,
) => {
  try {
    const resetToken = getPasswordResetCookie(request);

    if (!resetToken) {
      throw new AppError(
        "The password reset session is invalid or has expired",
        401,
        {
          code: "INVALID_OR_EXPIRED_RESET_SESSION",
        },
      );
    }

    await resetUserPassword(request.body, resetToken);

    clearPasswordResetCookie(response);

    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Pragma", "no-cache");

    response.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    /*
     * Sirf invalid ya expired reset session
     * par reset cookie clear hogi.
     *
     * Temporary server error ya recoverable
     * validation error par valid session
     * preserve rahegi.
     */
    if (
      error instanceof AppError &&
      error.code === "INVALID_OR_EXPIRED_RESET_SESSION"
    ) {
      clearPasswordResetCookie(response);
    }

    next(error);
  }
};

export const logout: RequestHandler = (_request, response) => {
  clearAuthCookie(response);
  clearPasswordResetCookie(response);

  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Pragma", "no-cache");

  response.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export const getMe: RequestHandler = async (request, response, next) => {
  try {
    const userId = request.auth?.userId;

    if (!userId) {
      throw new AppError("Authentication is required", 401, {
        code: "AUTHENTICATION_REQUIRED",
      });
    }

    const user = await getCurrentUser(userId);

    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Pragma", "no-cache");

    response.status(200).json({
      success: true,
      message: "Current user retrieved successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
