import { z } from "zod";

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

const PHONE_NUMBER_PATTERN = /^\+?[0-9][0-9\s()-]{7,19}$/;

export const updateProfileSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must contain at least 2 characters")
      .max(80, "Full name cannot exceed 80 characters")
      .optional(),

    username: z
      .string()
      .trim()
      .min(3, "Username must contain at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(
        USERNAME_PATTERN,
        "Username can only contain letters, numbers, dots, underscores, and hyphens",
      )
      .optional(),

    email: z
      .string()
      .trim()
      .email("A valid email address is required")
      .transform((value) => value.toLowerCase())
      .optional(),

    phoneNumber: z
      .string()
      .trim()
      .regex(PHONE_NUMBER_PATTERN, "A valid phone number is required")
      .optional(),

    city: z
      .string()
      .trim()
      .min(2, "City must contain at least 2 characters")
      .max(80, "City cannot exceed 80 characters")
      .optional(),

    gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  })
  .strict()
  .refine((input) => Object.keys(input).length > 0, {
    message: "At least one profile field is required",
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
