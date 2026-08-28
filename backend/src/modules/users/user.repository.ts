import { prisma } from "../../lib/prisma.js";

import type { UpdateProfileInput } from "./user.schema.js";

const publicUserSelect = {
  id: true,
  fullName: true,
  username: true,
  email: true,
  phoneNumber: true,
  city: true,
  gender: true,
  profileImageUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const userRepository = {
  findProfileConflict(userId: string, input: UpdateProfileInput) {
    const conflictConditions = [
      ...(input.email
        ? [
            {
              email: input.email,
            },
          ]
        : []),

      ...(input.username
        ? [
            {
              username: input.username,
            },
          ]
        : []),

      ...(input.phoneNumber
        ? [
            {
              phoneNumber: input.phoneNumber,
            },
          ]
        : []),
    ];

    if (conflictConditions.length === 0) {
      return Promise.resolve(null);
    }

    return prisma.user.findFirst({
      where: {
        id: {
          not: userId,
        },

        OR: conflictConditions,
      },

      select: {
        id: true,
        email: true,
        username: true,
        phoneNumber: true,
      },
    });
  },

  updateProfile(userId: string, input: UpdateProfileInput) {
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: input,

      select: publicUserSelect,
    });
  },

  findProfileImageByUserId(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        profileImagePublicId: true,
      },
    });
  },

  updateProfileImage(
    userId: string,
    profileImageUrl: string,
    profileImagePublicId: string,
  ) {
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        profileImageUrl,
        profileImagePublicId,
      },

      select: publicUserSelect,
    });
  },

  clearProfileImage(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        profileImageUrl: null,
        profileImagePublicId: null,
      },

      select: publicUserSelect,
    });
  },
};
