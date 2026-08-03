import type { RequestHandler } from "express";
import { fileTypeFromBuffer } from "file-type";
import multer from "multer";

import { env } from "../../config/env.js";
import { AppError } from "../errors/app-error.js";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

const allowedDetectedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const uploadProfileImageMiddleware = multer({
  storage: multer.memoryStorage(),

  limits: {
    files: 1,
    fileSize: env.MAX_PROFILE_IMAGE_SIZE_MB * 1024 * 1024,
  },

  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(
        new AppError("Profile image must be JPEG, PNG or WebP", 400, {
          code: "INVALID_PROFILE_IMAGE_TYPE",
        }),
      );
      return;
    }

    callback(null, true);
  },
});

export const validateProfileImage: RequestHandler = async (
  request,
  _response,
  next,
) => {
  try {
    if (!request.file) {
      throw new AppError("Profile image is required", 400, {
        code: "PROFILE_IMAGE_REQUIRED",
      });
    }

    const detectedType = await fileTypeFromBuffer(request.file.buffer);

    if (!detectedType || !allowedDetectedMimeTypes.has(detectedType.mime)) {
      throw new AppError(
        "Uploaded file is not a valid JPEG, PNG or WebP image",
        400,
        {
          code: "INVALID_PROFILE_IMAGE_CONTENT",
        },
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
