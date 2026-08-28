import type { Prisma } from "../../generated/prisma/client.js";

export const publicUserSelect = {
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
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{
  select: typeof publicUserSelect;
}>;

export interface UploadedProfileImage {
  url: string;
  publicId: string;
}

export interface LoginResult {
  user: PublicUser;
  accessToken: string;
}
