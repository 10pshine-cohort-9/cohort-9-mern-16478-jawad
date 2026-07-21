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

export const register: RequestHandler = async (request, response, next) => {
  try {
    if (!request.file) {
      throw new AppError("Profile image is required", 400, {
        code: "PROFILE_IMAGE_REQUIRED",
      });
    }

    const user = await registerUser(
      request.body as RegisterInput,
      request.file,
    );

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

export const login: RequestHandler = async (request, response, next) => {
  try {
    const result = await loginUser(request.body as LoginInput);

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

export const forgotPassword: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    await requestPasswordReset(request.body as ForgotPasswordInput);

    response.status(200).json({
      success: true,
      message:
        "If an account exists for this email, a password reset code has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyResetOtp: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const resetToken = await verifyPasswordResetOtp(
      request.body as VerifyResetOtpInput,
    );

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

export const resetPassword: RequestHandler = async (
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

    await resetUserPassword(request.body as ResetPasswordInput, resetToken);

    clearPasswordResetCookie(response);

    response.setHeader("Cache-Control", "no-store");

    response.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    clearPasswordResetCookie(response);

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
