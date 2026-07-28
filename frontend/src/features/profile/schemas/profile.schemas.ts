import { z } from "zod";

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

const PHONE_NUMBER_PATTERN = /^\+?[0-9][0-9\s()-]{7,19}$/;

export const profileFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must contain at least 2 characters")
    .max(80),

  username: z
    .string()
    .trim()
    .min(3, "Username must contain at least 3 characters")
    .max(30)
    .regex(
      USERNAME_PATTERN,
      "Only letters, numbers, dots, underscores, and hyphens are allowed",
    ),

  email: z.string().trim().email("A valid email address is required"),

  phoneNumber: z
    .string()
    .trim()
    .regex(PHONE_NUMBER_PATTERN, "A valid phone number is required"),

  city: z
    .string()
    .trim()
    .min(2, "City must contain at least 2 characters")
    .max(80),

  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
