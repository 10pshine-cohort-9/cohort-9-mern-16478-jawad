import { rateLimit } from "express-rate-limit";

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,

  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
    code: "LOGIN_RATE_LIMITED",
  },
});

export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
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
  windowMs: 15 * 60 * 1000,
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
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many password reset attempts. Please try again later.",
    code: "PASSWORD_RESET_RATE_LIMITED",
  },
});
