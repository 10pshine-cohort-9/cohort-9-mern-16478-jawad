interface AppErrorOptions {
  code?: string;
  details?: unknown;
  cause?: unknown;
}

/**
 * Represents an expected application error.
 *
 * Examples:
 * - Invalid request data
 * - Incorrect login credentials
 * - Resource not found
 * - Unauthorized access
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational = true;

  public constructor(
    message: string,
    statusCode: number,
    options: AppErrorOptions = {},
  ) {
    super(message, {
      cause: options.cause,
    });

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = options.code ?? "APPLICATION_ERROR";
    this.details = options.details;

    Error.captureStackTrace(this, AppError);
  }
}
