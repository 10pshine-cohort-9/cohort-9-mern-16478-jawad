import type { Prisma } from "../../generated/prisma/client.js";

import { prisma } from "../../lib/prisma.js";

import { publicUserSelect } from "./auth.types.js";

interface RegistrationIdentifiers {
  username: string;
  email: string;
  phoneNumber: string;
}

const loginUserSelect = {
  ...publicUserSelect,
  passwordHash: true,
} satisfies Prisma.UserSelect;

export type LoginUserRecord = Prisma.UserGetPayload<{
  select: typeof loginUserSelect;
}>;

export const authRepository = {
  findRegistrationConflict(identifiers: RegistrationIdentifiers) {
    return prisma.user.findFirst({
      where: {
        OR: [
          {
            username: identifiers.username,
          },
          {
            email: identifiers.email,
          },
          {
            phoneNumber: identifiers.phoneNumber,
          },
        ],
      },

      select: {
        username: true,
        email: true,
        phoneNumber: true,
      },
    });
  },

  createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      select: publicUserSelect,
    });
  },

  findUserForLogin(identifier: string) {
    return prisma.user.findFirst({
      where: {
        OR: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
      },

      select: loginUserSelect,
    });
  },

  findPublicUserById(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: publicUserSelect,
    });
  },

  findUserForPasswordReset(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },

      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });
  },

  upsertPasswordResetChallenge(
    userId: string,
    otpHash: string,
    expiresAt: Date,
  ) {
    return prisma.passwordReset.upsert({
      where: {
        userId,
      },

      update: {
        otpHash,
        attempts: 0,
        expiresAt,
        verifiedAt: null,
        resetTokenHash: null,
        resetTokenExpiresAt: null,
      },

      create: {
        userId,
        otpHash,
        expiresAt,
      },
    });
  },

  findPasswordResetByUserId(userId: string) {
    return prisma.passwordReset.findUnique({
      where: {
        userId,
      },
    });
  },

  incrementPasswordResetAttempts(id: string) {
    return prisma.passwordReset.update({
      where: {
        id,
      },

      data: {
        attempts: {
          increment: 1,
        },
      },

      select: {
        attempts: true,
      },
    });
  },

  markPasswordResetVerified(
    id: string,
    resetTokenHash: string,
    resetTokenExpiresAt: Date,
  ) {
    return prisma.passwordReset.update({
      where: {
        id,
      },

      data: {
        verifiedAt: new Date(),
        resetTokenHash,
        resetTokenExpiresAt,
      },
    });
  },

  findPasswordResetByTokenHash(resetTokenHash: string) {
    return prisma.passwordReset.findUnique({
      where: {
        resetTokenHash,
      },

      select: {
        id: true,
        userId: true,
        verifiedAt: true,
        resetTokenExpiresAt: true,

        user: {
          select: {
            email: true,
            fullName: true,
            passwordHash: true,
          },
        },
      },
    });
  },

  deletePasswordResetById(id: string) {
    return prisma.passwordReset.deleteMany({
      where: {
        id,
      },
    });
  },

  resetPasswordAndDeleteChallenge(
    resetId: string,
    userId: string,
    passwordHash: string,
  ) {
    return prisma.$transaction(async (transaction) => {
      const user = await transaction.user.update({
        where: {
          id: userId,
        },

        data: {
          passwordHash,
        },

        select: {
          email: true,
          fullName: true,
        },
      });

      await transaction.passwordReset.delete({
        where: {
          id: resetId,
        },
      });

      return user;
    });
  },
};
