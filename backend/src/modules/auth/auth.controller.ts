import type { RequestHandler } from "express";

import { AppError } from "../../common/errors/app-error.js";
<<<<<<< HEAD
=======

>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
import {
  clearAuthCookie,
  clearPasswordResetCookie,
  getPasswordResetCookie,
  setAuthCookie,
  setPasswordResetCookie,
} from "../../common/utils/auth-cookie.js";
<<<<<<< HEAD
=======

>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyResetOtpInput,
} from "./auth.schema.js";
<<<<<<< HEAD
=======

>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
import {
  getCurrentUser,
  loginUser,
  registerUser,
  requestPasswordReset,
  resetUserPassword,
  verifyPasswordResetOtp,
} from "./auth.service.js";

<<<<<<< HEAD
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
=======
export const register: RequestHandler = async (request, response, next) => {
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
  try {
    if (!request.file) {
      throw new AppError("Profile image is required", 400, {
        code: "PROFILE_IMAGE_REQUIRED",
      });
    }

<<<<<<< HEAD
    const user = await registerUser(request.body, request.file);
=======
    const user = await registerUser(
      request.body as RegisterInput,
      request.file,
    );
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)

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

<<<<<<< HEAD
export const login: AuthBodyRequestHandler<LoginInput> = async (
  request,
  response,
  next,
) => {
  try {
    const result = await loginUser(request.body);
=======
export const login: RequestHandler = async (request, response, next) => {
  try {
    const result = await loginUser(request.body as LoginInput);
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)

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

<<<<<<< HEAD
export const forgotPassword: AuthBodyRequestHandler<
  ForgotPasswordInput
> = async (request, response, next) => {
  try {
    await requestPasswordReset(request.body);
=======
export const forgotPassword: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    await requestPasswordReset(request.body as ForgotPasswordInput);
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)

    response.status(200).json({
      success: true,
      message:
        "If an account exists for this email, a password reset code has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

<<<<<<< HEAD
export const verifyResetOtp: AuthBodyRequestHandler<
  VerifyResetOtpInput
> = async (request, response, next) => {
  try {
    const resetToken = await verifyPasswordResetOtp(request.body);
=======
export const verifyResetOtp: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const resetToken = await verifyPasswordResetOtp(
      request.body as VerifyResetOtpInput,
    );
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)

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

<<<<<<< HEAD
export const resetPassword: AuthBodyRequestHandler<ResetPasswordInput> = async (
=======
export const resetPassword: RequestHandler = async (
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
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

<<<<<<< HEAD
    await resetUserPassword(request.body, resetToken);
=======
    await resetUserPassword(request.body as ResetPasswordInput, resetToken);
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)

    clearPasswordResetCookie(response);

    response.setHeader("Cache-Control", "no-store");

    response.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
<<<<<<< HEAD
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
=======
    clearPasswordResetCookie(response);
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)

    next(error);
  }
};

export const logout: RequestHandler = (_request, response) => {
  clearAuthCookie(response);
<<<<<<< HEAD

=======
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
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
