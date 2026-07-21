import { Router } from "express";

// import {
//   forgotPasswordLimiter,
//   resetPasswordLimiter,
//   verifyResetOtpLimiter,
// } from "../../common/middleware/auth-rate-limit.middleware.js";
import {
  forgotPasswordLimiter,
<<<<<<< HEAD
<<<<<<< HEAD
  loginLimiter,
  registerLimiter,
  resetPasswordLimiter,
  verifyResetOtpLimiter,
} from "../../common/middleware/auth-rate-limit.middleware.js";
import { authenticate } from "../../common/middleware/authenticate.middleware.js";
=======
=======
  loginLimiter,
  registerLimiter,
>>>>>>> 2d5ae08 (fix(auth): rate limit registration and login attempts)
  resetPasswordLimiter,
  verifyResetOtpLimiter,
} from "../../common/middleware/auth-rate-limit.middleware.js";

>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
import {
  uploadProfileImageMiddleware,
  validateProfileImage,
} from "../../common/middleware/upload-profile-image.middleware.js";
<<<<<<< HEAD
import { validateBody } from "../../common/middleware/validate.middleware.js";
=======

import { validateBody } from "../../common/middleware/validate.middleware.js";

>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
import {
  forgotPassword,
  getMe,
  login,
<<<<<<< HEAD
  logout,
  register,
  resetPassword,
  verifyResetOtp,
} from "./auth.controller.js";
=======
  register,
  logout,
  resetPassword,
  verifyResetOtp,
} from "./auth.controller.js";

>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verifyResetOtpSchema,
} from "./auth.schema.js";

<<<<<<< HEAD
=======
import { authenticate } from "../../common/middleware/authenticate.middleware.js";

>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
export const authRouter = Router();

// authRouter.post(
//   "/register",
//   uploadProfileImageMiddleware.single("profileImage"),
//   validateProfileImage,
//   validateBody(registerSchema),
//   register,
// );
authRouter.post(
  "/register",
<<<<<<< HEAD
<<<<<<< HEAD
  registerLimiter,
=======
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
=======
  registerLimiter,
>>>>>>> 2d5ae08 (fix(auth): rate limit registration and login attempts)
  uploadProfileImageMiddleware.single("profileImage"),
  validateProfileImage,
  validateBody(registerSchema),
  register,
);

<<<<<<< HEAD
<<<<<<< HEAD
authRouter.post("/login", loginLimiter, validateBody(loginSchema), login);
=======
authRouter.post("/login", validateBody(loginSchema), login);
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
=======
// authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/login", loginLimiter, validateBody(loginSchema), login);
>>>>>>> 2d5ae08 (fix(auth): rate limit registration and login attempts)

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
