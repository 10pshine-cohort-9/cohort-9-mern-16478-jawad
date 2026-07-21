import { rateLimit } from "express-rate-limit";

<<<<<<< HEAD
<<<<<<< HEAD
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
=======
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;

export const registerLimiter = rateLimit({
  windowMs: ONE_HOUR_MS,
>>>>>>> 2d5ae08 (fix(auth): rate limit registration and login attempts)
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
<<<<<<< HEAD
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
=======
  windowMs: FIFTEEN_MINUTES_MS,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,

  /*
   * Successful login attempts are removed from the counter.
   * Only failed attempts meaningfully consume the limit.
   */
>>>>>>> 2d5ae08 (fix(auth): rate limit registration and login attempts)
  skipSuccessfulRequests: true,

  message: {
    success: false,
<<<<<<< HEAD
    message: "Too many login attempts. Please try again later.",
=======
    message: "Too many failed login attempts. Please try again later.",
>>>>>>> 2d5ae08 (fix(auth): rate limit registration and login attempts)
    code: "LOGIN_RATE_LIMITED",
  },
});

<<<<<<< HEAD
=======
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
=======
>>>>>>> 2d5ae08 (fix(auth): rate limit registration and login attempts)
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
