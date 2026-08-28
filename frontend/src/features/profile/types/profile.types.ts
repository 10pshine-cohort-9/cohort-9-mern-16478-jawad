import type { Gender, PublicUser } from "@/features/auth/types/auth.types";

export interface UpdateProfileRequest {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  city: string;
  gender: Gender;
}

export interface ProfileUserData {
  user: PublicUser;
}

export type ProfileTab = "all" | "favorites";
