import type {
  CookieOptions,
  Request,
  Response
} from "express";

import { env } from "../../config/env.js";

const getBaseCookieOptions =
  (): CookieOptions => {
    return {
      httpOnly: true,
      secure:
        env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    };
  };

const getPasswordResetCookieOptions =
  (): CookieOptions => {
    return {
      httpOnly: true,
      secure:
        env.NODE_ENV === "production",
      sameSite: "strict",
      path:
        "/api/v1/auth/reset-password"
    };
  };

export const setAuthCookie = (
  response: Response,
  token: string
): void => {
  response.cookie(
    env.COOKIE_NAME,
    token,
    {
      ...getBaseCookieOptions(),
      maxAge:
        env.AUTH_COOKIE_MAX_AGE_MS
    }
  );
};

export const clearAuthCookie = (
  response: Response
): void => {
  response.clearCookie(
    env.COOKIE_NAME,
    getBaseCookieOptions()
  );
};

export const setPasswordResetCookie = (
  response: Response,
  token: string
): void => {
  response.cookie(
    env.PASSWORD_RESET_COOKIE_NAME,
    token,
    {
      ...getPasswordResetCookieOptions(),

      maxAge:
        env
          .PASSWORD_RESET_TOKEN_TTL_MINUTES *
        60 *
        1000
    }
  );
};

export const getPasswordResetCookie = (
  request: Request
): string | undefined => {
  const value =
    request.cookies?.[
      env.PASSWORD_RESET_COOKIE_NAME
    ];

  return typeof value === "string"
    ? value
    : undefined;
};

export const clearPasswordResetCookie = (
  response: Response
): void => {
  response.clearCookie(
    env.PASSWORD_RESET_COOKIE_NAME,
    getPasswordResetCookieOptions()
  );
};