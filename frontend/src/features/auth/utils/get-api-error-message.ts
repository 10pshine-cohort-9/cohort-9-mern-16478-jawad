import axios from "axios";

import type { ApiErrorResponse } from "@/features/auth/types/auth.types";

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

export const getApiErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      return error.message;
    }

    return DEFAULT_ERROR_MESSAGE;
  }

  const responseData = error.response?.data as ApiErrorResponse | undefined;

  if (responseData?.errors && responseData.errors.length > 0) {
    return responseData.errors[0].message;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (error.code === "ERR_NETWORK") {
    return "Unable to connect to the server. Make sure the backend is running.";
  }

  if (error.response?.status === 429) {
    return "Too many requests. Please wait before trying again.";
  }

  if (error.response?.status === 401) {
    return "Your session is invalid or has expired.";
  }

  return DEFAULT_ERROR_MESSAGE;
};
