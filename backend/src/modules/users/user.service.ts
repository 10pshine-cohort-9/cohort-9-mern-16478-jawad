import { AppError } from "../../common/errors/app-error.js";
import {
  deleteProfileImage,
  uploadProfileImage,
} from "../../common/utils/cloudinary-image.js";
import { logger } from "../../lib/logger.js";

import type { PublicUser } from "../auth/auth.types.js";

import { userRepository } from "./user.repository.js";
import type { UpdateProfileInput } from "./user.schema.js";

interface ProfileConflict {
  email: string;
  username: string;
  phoneNumber: string;
}

const isPrismaErrorCode = (error: unknown, code: string): boolean => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
};

const createConflictError = (
  conflict: ProfileConflict,
  input: UpdateProfileInput,
): AppError => {
  if (input.email !== undefined && conflict.email === input.email) {
    return new AppError("An account with this email already exists", 409, {
      code: "EMAIL_ALREADY_IN_USE",
    });
  }

  if (input.username !== undefined && conflict.username === input.username) {
    return new AppError("This username is already taken", 409, {
      code: "USERNAME_ALREADY_IN_USE",
    });
  }

  return new AppError("An account with this phone number already exists", 409, {
    code: "PHONE_NUMBER_ALREADY_IN_USE",
  });
};

export const updateUserProfile = async (
  userId: string,
  input: UpdateProfileInput,
): Promise<PublicUser> => {
  const conflict = await userRepository.findProfileConflict(userId, input);

  if (conflict) {
    throw createConflictError(conflict, input);
  }

  try {
    const user = await userRepository.updateProfile(userId, input);

    logger.info(
      {
        userId,
        updatedFields: Object.keys(input),
      },
      "User profile updated successfully",
    );

    return user;
  } catch (error) {
    if (isPrismaErrorCode(error, "P2002")) {
      throw new AppError(
        "The supplied profile information is already in use",
        409,
        {
          code: "PROFILE_INFORMATION_ALREADY_IN_USE",
        },
      );
    }

    if (isPrismaErrorCode(error, "P2025")) {
      throw new AppError("User profile was not found", 404, {
        code: "USER_NOT_FOUND",
      });
    }

    logger.error(
      {
        err: error,
        userId,
      },
      "Failed to update user profile",
    );

    throw new AppError("Profile could not be updated", 500, {
      code: "PROFILE_UPDATE_FAILED",
      cause: error,
    });
  }
};

export const replaceUserProfileImage = async (
  userId: string,
  profileImageFile: Express.Multer.File,
): Promise<PublicUser> => {
  const existingProfile = await userRepository.findProfileImageByUserId(userId);

  if (!existingProfile) {
    throw new AppError("User profile was not found", 404, {
      code: "USER_NOT_FOUND",
    });
  }

  let uploadedImage;

  try {
    uploadedImage = await uploadProfileImage(profileImageFile);
  } catch (error) {
    logger.error(
      {
        err: error,
        userId,
      },
      "New profile image upload failed",
    );

    throw new AppError("Profile image could not be uploaded", 500, {
      code: "PROFILE_IMAGE_UPLOAD_FAILED",
      cause: error,
    });
  }

  let updatedUser: PublicUser;

  try {
    updatedUser = await userRepository.updateProfileImage(
      userId,
      uploadedImage.url,
      uploadedImage.publicId,
    );
  } catch (error) {
    try {
      await deleteProfileImage(uploadedImage.publicId);
    } catch (cleanupError) {
      logger.error(
        {
          err: cleanupError,
          publicId: uploadedImage.publicId,
        },
        "New profile image cleanup failed after database error",
      );
    }

    logger.error(
      {
        err: error,
        userId,
      },
      "Profile image database update failed",
    );

    throw new AppError("Profile image could not be updated", 500, {
      code: "PROFILE_IMAGE_UPDATE_FAILED",
      cause: error,
    });
  }

  if (
    existingProfile.profileImagePublicId &&
    existingProfile.profileImagePublicId !== uploadedImage.publicId
  ) {
    try {
      await deleteProfileImage(existingProfile.profileImagePublicId);
    } catch (error) {
      /*
       * Database already points to the
       * new image. Old-image cleanup
       * failure should not fail the
       * successful API request.
       */
      logger.warn(
        {
          err: error,
          userId,
          publicId: existingProfile.profileImagePublicId,
        },
        "Old profile image could not be deleted",
      );
    }
  }

  logger.info(
    {
      userId,
    },
    "User profile image updated successfully",
  );

  return updatedUser;
};

export const removeUserProfileImage = async (
  userId: string,
): Promise<PublicUser> => {
  const existingProfile = await userRepository.findProfileImageByUserId(userId);

  if (!existingProfile) {
    throw new AppError("User profile was not found", 404, {
      code: "USER_NOT_FOUND",
    });
  }

  if (!existingProfile.profileImagePublicId) {
    throw new AppError("Profile image is not currently set", 409, {
      code: "PROFILE_IMAGE_NOT_SET",
    });
  }

  try {
    await deleteProfileImage(existingProfile.profileImagePublicId);
  } catch (error) {
    logger.error(
      {
        err: error,
        userId,
        publicId: existingProfile.profileImagePublicId,
      },
      "Profile image could not be deleted from storage",
    );

    throw new AppError("Profile image could not be deleted", 500, {
      code: "PROFILE_IMAGE_DELETE_FAILED",
      cause: error,
    });
  }

  try {
    const user = await userRepository.clearProfileImage(userId);

    logger.info(
      {
        userId,
      },
      "User profile image removed successfully",
    );

    return user;
  } catch (error) {
    logger.error(
      {
        err: error,
        userId,
      },
      "Profile image metadata could not be cleared",
    );

    throw new AppError(
      "Profile image could not be removed from the account",
      500,
      {
        code: "PROFILE_IMAGE_METADATA_CLEAR_FAILED",
        cause: error,
      },
    );
  }
};
