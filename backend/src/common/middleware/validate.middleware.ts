import type { RequestHandler } from "express";
import { z, type ZodType } from "zod";

import { AppError } from "../errors/app-error.js";

export const validateBody = <T extends ZodType>(
  schema: T
): RequestHandler => {
  return (request, _response, next) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      next(
        new AppError("Request validation failed", 400, {
          code: "VALIDATION_ERROR",
          details: z.flattenError(result.error),
        }),
      );
      return;
    }

    request.body = result.data as z.infer<T>;
    next();
  };
};