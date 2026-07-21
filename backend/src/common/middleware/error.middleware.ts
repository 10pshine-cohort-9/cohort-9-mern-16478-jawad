import type { ErrorRequestHandler } from "express";
import multer from "multer";

import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";
import { AppError } from "../errors/app-error.js";

interface ErrorResponseBody {
  success: false;
  message: string;
  code: string;
  requestId?: string | number | string[];
  errors?: unknown;
  stack?: string;
}

/**
 * Converts unknown errors into the application's standard AppError format.
 */
const normalizeError = (error: unknown): AppError => {
  // Existing application errors ko same form mein return karega.
  if (error instanceof AppError) {
    return error;
  }

  // Multer file-upload errors handle karega.
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return new AppError(
        `Profile image cannot exceed ${env.MAX_PROFILE_IMAGE_SIZE_MB} MB`,
        400,
        {
          code: "PROFILE_IMAGE_TOO_LARGE",
        },
      );
    }

    return new AppError("Profile image upload request is invalid", 400, {
      code: "PROFILE_IMAGE_UPLOAD_ERROR",
    });
  }

  // Baqi unknown errors ko internal server error banayega.
  return new AppError("Internal server error", 500, {
    code: "INTERNAL_SERVER_ERROR",
    cause: error,
  });
};

/**
 * Handles every application error from one central location.
 *
 * Important:
 * Express identifies this as an error middleware because it contains
 * all four parameters: error, request, response and next.
 */
export const globalErrorHandler: ErrorRequestHandler = (
  error: unknown,
  request,
  response,
  _next,
) => {
  const normalizedError = normalizeError(error);

  const requestId = response.getHeader("X-Request-Id");

  const logContext = {
    err: error instanceof Error ? error : new Error(String(error)),
    requestId,
    statusCode: normalizedError.statusCode,
    method: request.method,
    path: request.originalUrl,
  };

  if (normalizedError.statusCode >= 500) {
    logger.error(logContext, "Request failed unexpectedly");
  } else {
    logger.warn(logContext, "Request rejected");
  }

  const responseBody: ErrorResponseBody = {
    success: false,
    message:
      env.NODE_ENV === "production" && normalizedError.statusCode >= 500
        ? "Internal server error"
        : normalizedError.message,
    code: normalizedError.code,
    requestId,
  };

  if (
    normalizedError.details !== undefined &&
    !(env.NODE_ENV === "production" && normalizedError.statusCode >= 500)
  ) {
    responseBody.errors = normalizedError.details;
  }

  if (env.NODE_ENV !== "production" && error instanceof Error && error.stack) {
    responseBody.stack = error.stack;
  }

  response.status(normalizedError.statusCode).json(responseBody);
};
