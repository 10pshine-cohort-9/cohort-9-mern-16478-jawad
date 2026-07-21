import { rateLimit } from "express-rate-limit";

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;

export const registerLimiter = rateLimit({
  windowMs: ONE_HOUR_MS,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
    code: "REGISTRATION_RATE_LIMITED",
  },
});

export const loginLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,

  /*
   * Successful login attempts are removed from the counter.
   * Only failed attempts meaningfully consume the limit.
   */
  skipSuccessfulRequests: true,

  message: {
    success: false,
    message: "Too many failed login attempts. Please try again later.",
    code: "LOGIN_RATE_LIMITED",
  },
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many password reset requests. Please try again later.",
    code: "PASSWORD_RESET_RATE_LIMITED",
  },
});

export const verifyResetOtpLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many OTP verification attempts. Please try again later.",
    code: "OTP_VERIFICATION_RATE_LIMITED",
  },
});

export const resetPasswordLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many password reset attempts. Please try again later.",
    code: "PASSWORD_RESET_RATE_LIMITED",
  },
});
