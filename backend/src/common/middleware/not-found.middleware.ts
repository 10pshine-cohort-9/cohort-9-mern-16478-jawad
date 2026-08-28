import type { RequestHandler } from "express";

import { AppError } from "../errors/app-error.js";

/**
 * Converts every unmatched route into a structured 404 error.
 *
 * This middleware must be registered after all application routes.
 */
export const notFoundHandler: RequestHandler = (request, _response, next) => {
  next(
    new AppError(
      `Route ${request.method} ${request.originalUrl} was not found`,
      404,
      {
        code: "ROUTE_NOT_FOUND",
      },
    ),
  );
};
