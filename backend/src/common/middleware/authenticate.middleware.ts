import type { RequestHandler } from "express";

import { env } from "../../config/env.js";
import { clearAuthCookie } from "../utils/auth-cookie.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { AppError } from "../errors/app-error.js";

const createAuthenticationError = (): AppError => {
  return new AppError("Authentication is required", 401, {
    code: "AUTHENTICATION_REQUIRED",
  });
};

export const authenticate: RequestHandler = (request, response, next) => {
  try {
    const tokenValue = request.cookies?.[env.COOKIE_NAME];

    if (typeof tokenValue !== "string" || tokenValue.length === 0) {
      throw createAuthenticationError();
    }

    const userId = verifyAccessToken(tokenValue);

    request.auth = {
      userId,
    };

    next();
  } catch {
    clearAuthCookie(response);
    next(createAuthenticationError());
  }
};
