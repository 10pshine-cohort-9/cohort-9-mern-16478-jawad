import { Router } from "express";

import { authenticate } from "../../common/middleware/authenticate.middleware.js";
import {
  uploadProfileImageMiddleware,
  validateProfileImage,
} from "../../common/middleware/upload-profile-image.middleware.js";
import { validateBody } from "../../common/middleware/validate.middleware.js";

import {
  updateMe,
  updateMyProfileImage,
  deleteMyProfileImage,
} from "./user.controller.js";
import { updateProfileSchema } from "./user.schema.js";

export const userRouter = Router();

userRouter.patch(
  "/me",
  authenticate,
  validateBody(updateProfileSchema),
  updateMe,
);

userRouter.patch(
  "/me/profile-image",
  authenticate,
  uploadProfileImageMiddleware.single("profileImage"),
  validateProfileImage,
  updateMyProfileImage,
);

userRouter.delete("/me/profile-image", authenticate, deleteMyProfileImage);
