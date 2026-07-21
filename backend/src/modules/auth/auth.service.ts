import { AppError } from "../../common/errors/app-error.js";
import {
  deleteProfileImage,
  uploadProfileImage,
} from "../../common/utils/cloudinary-image.js";
import { hashPassword, verifyPassword } from "../../common/utils/password.js";
import { logger } from "../../lib/logger.js";
import { sendWelcomeEmail } from "./auth-email.service.js";
import { authRepository } from "./auth.repository.js";
import type { RegisterInput } from "./auth.schema.js";
import type {
  PublicUser,
  LoginResult,
  UploadedProfileImage,
} from "./auth.types.js";

import { createAccessToken } from "../../common/utils/jwt.js";
import type { LoginInput } from "./auth.schema.js";
import type { LoginUserRecord } from "./auth.repository.js";

import { env } from "../../config/env.js";
import {
  generatePasswordResetOtp,
  generatePasswordResetToken,
  hashPasswordResetOtp,
  hashPasswordResetToken,
  verifyPasswordResetOtpHash,
} from "../../common/utils/password-reset.js";
import {
  sendPasswordResetOtpEmail,
  sendPasswordResetSuccessEmail,
} from "./auth-email.service.js";
import type {
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyResetOtpInput,
} from "./auth.schema.js";

const createRegistrationConflictError = (
  conflict: {
    email: string;
    username: string;
    phoneNumber: string;
  },
  input: RegisterInput,
): AppError => {
  if (conflict.email === input.email) {
    return new AppError("An account with this email already exists", 409, {
      code: "EMAIL_ALREADY_IN_USE",
    });
  }

  if (conflict.username === input.username) {
    return new AppError("This username is already taken", 409, {
      code: "USERNAME_ALREADY_IN_USE",
    });
  }

  return new AppError("An account with this phone number already exists", 409, {
    code: "PHONE_NUMBER_ALREADY_IN_USE",
  });
};

const isUniqueConstraintError = (
  error: unknown,
): error is { code: "P2002" } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
};

const createInvalidCredentialsError = (): AppError => {
  return new AppError("Invalid email/username or password", 401, {
    code: "INVALID_CREDENTIALS",
  });
};

const mapLoginUserToPublicUser = (account: LoginUserRecord): PublicUser => {
  return {
    id: account.id,
    fullName: account.fullName,
    username: account.username,
    email: account.email,
    phoneNumber: account.phoneNumber,
    city: account.city,
    gender: account.gender,
    profileImageUrl: account.profileImageUrl,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  };
};

export const registerUser = async (
  input: RegisterInput,
  profileImageFile: Express.Multer.File,
): Promise<PublicUser> => {
  const conflict = await authRepository.findRegistrationConflict({
    username: input.username,
    email: input.email,
    phoneNumber: input.phoneNumber,
  });

  if (conflict) {
    throw createRegistrationConflictError(conflict, input);
  }

  const passwordHash = await hashPassword(input.password);

  let uploadedImage: UploadedProfileImage | undefined;

  try {
    uploadedImage = await uploadProfileImage(profileImageFile);

    const user = await authRepository.createUser({
      fullName: input.fullName,
      username: input.username,
      email: input.email,
      phoneNumber: input.phoneNumber,
      city: input.city,
      gender: input.gender,
      profileImageUrl: uploadedImage.url,
      profileImagePublicId: uploadedImage.publicId,
      passwordHash,
    });

    logger.info(
      {
        userId: user.id,
        username: user.username,
      },
      "User account created successfully",
    );

    void sendWelcomeEmail({
      email: user.email,
      fullName: user.fullName,
    }).catch((error: unknown) => {
      logger.warn(
        {
          err: error,
          userId: user.id,
        },
        "Welcome email could not be delivered",
      );
    });

    return user;
  } catch (error) {
    if (uploadedImage) {
      try {
        await deleteProfileImage(uploadedImage.publicId);
      } catch (cleanupError) {
        logger.error(
          {
            err: cleanupError,
            publicId: uploadedImage.publicId,
          },
          "Failed to clean up uploaded profile image",
        );
      }
    }

    if (isUniqueConstraintError(error)) {
      throw new AppError(
        "An account with the supplied information already exists",
        409,
        {
          code: "ACCOUNT_ALREADY_EXISTS",
        },
      );
    }

    throw error;
  }
};

export const loginUser = async (input: LoginInput): Promise<LoginResult> => {
<<<<<<< HEAD
  try {
    const account = await authRepository.findUserForLogin(input.identifier);

    if (!account) {
      throw createInvalidCredentialsError();
    }

    const passwordMatches = await verifyPassword(
      input.password,
      account.passwordHash,
    );

    if (!passwordMatches) {
      throw createInvalidCredentialsError();
    }

    const user = mapLoginUserToPublicUser(account);

    const accessToken = createAccessToken(user.id);

    logger.info(
      {
        userId: user.id,
        username: user.username,
      },
      "User logged in successfully",
    );

    return {
      user,
      accessToken,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Login could not be completed", 500, {
      code: "LOGIN_FAILED",
      cause: error,
    });
  }
=======
  const account = await authRepository.findUserForLogin(input.identifier);

  if (!account) {
    throw createInvalidCredentialsError();
  }

  const passwordMatches = await verifyPassword(
    input.password,
    account.passwordHash,
  );

  if (!passwordMatches) {
    throw createInvalidCredentialsError();
  }

  const user = mapLoginUserToPublicUser(account);

  const accessToken = createAccessToken(user.id);

  logger.info(
    {
      userId: user.id,
      username: user.username,
    },
    "User logged in successfully",
  );

  return {
    user,
    accessToken,
  };
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
};

const createInvalidOtpError = (): AppError => {
  return new AppError("The verification code is invalid or has expired", 400, {
    code: "INVALID_OR_EXPIRED_RESET_OTP",
  });
};

const createInvalidResetSessionError = (): AppError => {
  return new AppError(
    "The password reset session is invalid or has expired",
    401,
    {
      code: "INVALID_OR_EXPIRED_RESET_SESSION",
    },
  );
};

export const requestPasswordReset = async (
  input: ForgotPasswordInput,
): Promise<void> => {
  const user = await authRepository.findUserForPasswordReset(input.email);

  /*
   * Unknown email par bhi same successful
   * API response diya jayega.
   */
  if (!user) {
    return;
  }

  const otp = generatePasswordResetOtp();

  const otpHash = hashPasswordResetOtp(otp);

  const expiresAt = new Date(
    Date.now() + env.PASSWORD_RESET_OTP_TTL_MINUTES * 60 * 1000,
  );

  await authRepository.upsertPasswordResetChallenge(
    user.id,
    otpHash,
    expiresAt,
  );

<<<<<<< HEAD
  void sendPasswordResetOtpEmail({
    email: user.email,
    fullName: user.fullName,
    otp,
    expiresInMinutes: env.PASSWORD_RESET_OTP_TTL_MINUTES,
  })
    .then(() => {
      logger.info(
        {
          userId: user.id,
        },
        "Password reset OTP email sent",
      );
    })
    .catch((error: unknown) => {
      logger.error(
        {
          err: error,
          userId: user.id,
        },
        "Password reset OTP email could not be delivered",
      );
    });
};

export const verifyPasswordResetOtp = async (
  input: VerifyResetOtpInput,
): Promise<string> => {
  try {
    const user = await authRepository.findUserForPasswordReset(input.email);

    if (!user) {
      throw createInvalidOtpError();
    }

    const challenge = await authRepository.findPasswordResetByUserId(user.id);

    if (!challenge) {
      throw createInvalidOtpError();
    }

    /*
     * An already verified reset session must not be deleted.
     * A repeated request is rejected, but the valid reset
     * session remains available for reset-password.
     */
    if (challenge.verifiedAt !== null) {
      throw createInvalidOtpError();
    }

    const isExpired = challenge.expiresAt <= new Date();

    const hasReachedAttemptLimit =
      challenge.attempts >= env.PASSWORD_RESET_MAX_ATTEMPTS;

    if (isExpired || hasReachedAttemptLimit) {
      await authRepository.deletePasswordResetById(challenge.id);

      throw createInvalidOtpError();
    }

    const otpMatches = verifyPasswordResetOtpHash(input.otp, challenge.otpHash);

    if (!otpMatches) {
      const updatedChallenge =
        await authRepository.incrementPasswordResetAttempts(challenge.id);

      if (updatedChallenge.attempts >= env.PASSWORD_RESET_MAX_ATTEMPTS) {
        await authRepository.deletePasswordResetById(challenge.id);
      }

      throw createInvalidOtpError();
    }

    const resetToken = generatePasswordResetToken();

    const resetTokenHash = hashPasswordResetToken(resetToken);

    const resetTokenExpiresAt = new Date(
      Date.now() + env.PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000,
    );

    await authRepository.markPasswordResetVerified(
      challenge.id,
      resetTokenHash,
      resetTokenExpiresAt,
    );
=======
  try {
    await sendPasswordResetOtpEmail({
      email: user.email,
      fullName: user.fullName,
      otp,
      expiresInMinutes: env.PASSWORD_RESET_OTP_TTL_MINUTES,
    });
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)

    logger.info(
      {
        userId: user.id,
      },
<<<<<<< HEAD
      "Password reset OTP verified",
    );

    return resetToken;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      "Password reset verification could not be completed",
      500,
      {
        code: "PASSWORD_RESET_OTP_VERIFICATION_FAILED",
        cause: error,
      },
=======
      "Password reset OTP email sent",
    );
  } catch (error) {
    logger.error(
      {
        err: error,
        userId: user.id,
      },
      "Password reset OTP email could not be delivered",
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
    );
  }
};

<<<<<<< HEAD
=======
export const verifyPasswordResetOtp = async (
  input: VerifyResetOtpInput,
): Promise<string> => {
  const user = await authRepository.findUserForPasswordReset(input.email);

  if (!user) {
    throw createInvalidOtpError();
  }

  const challenge = await authRepository.findPasswordResetByUserId(user.id);

  const now = new Date();

  if (
    !challenge ||
    challenge.expiresAt <= now ||
    challenge.verifiedAt !== null ||
    challenge.attempts >= env.PASSWORD_RESET_MAX_ATTEMPTS
  ) {
    if (challenge) {
      await authRepository.deletePasswordResetById(challenge.id);
    }

    throw createInvalidOtpError();
  }

  const otpMatches = verifyPasswordResetOtpHash(input.otp, challenge.otpHash);

 
  if (!otpMatches) {
    const updatedChallenge =
      await authRepository.incrementPasswordResetAttempts(challenge.id);

    if (updatedChallenge.attempts >= env.PASSWORD_RESET_MAX_ATTEMPTS) {
      await authRepository.deletePasswordResetById(challenge.id);
    }

    throw createInvalidOtpError();
  }

  const resetToken = generatePasswordResetToken();

  const resetTokenHash = hashPasswordResetToken(resetToken);

  const resetTokenExpiresAt = new Date(
    Date.now() + env.PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000,
  );

  await authRepository.markPasswordResetVerified(
    challenge.id,
    resetTokenHash,
    resetTokenExpiresAt,
  );

  logger.info(
    {
      userId: user.id,
    },
    "Password reset OTP verified",
  );

  return resetToken;
};

>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
export const resetUserPassword = async (
  input: ResetPasswordInput,
  resetToken: string,
): Promise<void> => {
  const resetTokenHash = hashPasswordResetToken(resetToken);

  const challenge =
    await authRepository.findPasswordResetByTokenHash(resetTokenHash);

  if (
    !challenge ||
    !challenge.verifiedAt ||
    !challenge.resetTokenExpiresAt ||
    challenge.resetTokenExpiresAt <= new Date()
  ) {
    throw createInvalidResetSessionError();
  }

  const matchesOldPassword = await verifyPassword(
    input.password,
    challenge.user.passwordHash,
  );

  if (matchesOldPassword) {
    throw new AppError(
      "New password must be different from the current password",
      400,
      {
        code: "NEW_PASSWORD_MUST_BE_DIFFERENT",
      },
    );
  }

  const passwordHash = await hashPassword(input.password);

  const user = await authRepository.resetPasswordAndDeleteChallenge(
    challenge.id,
    challenge.userId,
    passwordHash,
  );

  logger.info(
    {
      userId: challenge.userId,
    },
    "User password reset successfully",
  );

  void sendPasswordResetSuccessEmail({
    email: user.email,
    fullName: user.fullName,
  }).catch((error: unknown) => {
    logger.warn(
      {
        err: error,
        userId: challenge.userId,
      },
      "Password reset confirmation email could not be delivered",
    );
  });
};

export const getCurrentUser = async (userId: string): Promise<PublicUser> => {
<<<<<<< HEAD
  try {
    const user = await authRepository.findPublicUserById(userId);

    if (!user) {
      throw new AppError("Authenticated user no longer exists", 401, {
        code: "AUTHENTICATED_USER_NOT_FOUND",
      });
    }

    return user;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Current user could not be retrieved", 500, {
      code: "CURRENT_USER_LOOKUP_FAILED",
      cause: error,
    });
  }
=======
  const user = await authRepository.findPublicUserById(userId);

  if (!user) {
    throw new AppError("Authenticated user no longer exists", 401, {
      code: "AUTHENTICATED_USER_NOT_FOUND",
    });
  }

  return user;
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
};
