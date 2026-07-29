import { Router } from "express";

import {
  forgotPasswordLimiter,
  loginLimiter,
  registerLimiter,
  resetPasswordLimiter,
  verifyResetOtpLimiter,
} from "../../common/middleware/auth-rate-limit.middleware.js";
import { authenticate } from "../../common/middleware/authenticate.middleware.js";
import {
  uploadProfileImageMiddleware,
  validateProfileImage,
} from "../../common/middleware/upload-profile-image.middleware.js";
import { validateBody } from "../../common/middleware/validate.middleware.js";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
  verifyResetOtp,
} from "./auth.controller.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyResetOtpSchema,
} from "./auth.schema.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  registerLimiter,
  uploadProfileImageMiddleware.single("profileImage"),
  validateProfileImage,
  validateBody(registerSchema),
  register,
);

authRouter.post("/login", loginLimiter, validateBody(loginSchema), login);

authRouter.get("/me", authenticate, getMe);

authRouter.post("/logout", logout);

authRouter.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validateBody(forgotPasswordSchema),
  forgotPassword,
);

authRouter.post(
  "/verify-reset-otp",
  verifyResetOtpLimiter,
  validateBody(verifyResetOtpSchema),
  verifyResetOtp,
);

authRouter.post(
  "/reset-password",
  resetPasswordLimiter,
  validateBody(resetPasswordSchema),
  resetPassword,
);
