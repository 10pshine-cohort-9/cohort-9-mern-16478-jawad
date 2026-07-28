import type { AuthUserResponse } from "@/features/auth/types/auth.types";
import { apiClient } from "@/services/api-client";

import type { UpdateProfileRequest } from "../types/profile.types";

export const updateProfile = async (
  input: UpdateProfileRequest,
): Promise<AuthUserResponse> => {
  const response = await apiClient.patch<AuthUserResponse>("/users/me", input);

  return response.data;
};

export const updateProfileImage = async (
  profileImage: File,
): Promise<AuthUserResponse> => {
  const formData = new FormData();

  formData.append("profileImage", profileImage);

  const response = await apiClient.patch<AuthUserResponse>(
    "/users/me/profile-image",
    formData,
  );

  return response.data;
};

export const deleteProfileImage = async (): Promise<AuthUserResponse> => {
  const response = await apiClient.delete<AuthUserResponse>(
    "/users/me/profile-image",
  );

  return response.data;
};
