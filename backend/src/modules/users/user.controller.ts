import type { Request, RequestHandler } from "express";

import { AppError } from "../../common/errors/app-error.js";

import type { UpdateProfileInput } from "./user.schema.js";
import {
  replaceUserProfileImage,
  updateUserProfile,
  removeUserProfileImage,
} from "./user.service.js";

const getAuthenticatedUserId = (request: Request): string => {
  const userId = request.auth?.userId;

  if (!userId) {
    throw new AppError("Authentication is required", 401, {
      code: "AUTHENTICATION_REQUIRED",
    });
  }

  return userId;
};

export const updateMe: RequestHandler = async (request, response, next) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const user = await updateUserProfile(
      userId,
      request.body as UpdateProfileInput,
    );

    response.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfileImage: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const userId = getAuthenticatedUserId(request);

    if (!request.file) {
      throw new AppError("A profile image is required", 400, {
        code: "PROFILE_IMAGE_REQUIRED",
      });
    }

    const user = await replaceUserProfileImage(userId, request.file);

    response.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMyProfileImage: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const userId = getAuthenticatedUserId(request);

    const user = await removeUserProfileImage(userId);

    response.status(200).json({
      success: true,
      message: "Profile image removed successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
