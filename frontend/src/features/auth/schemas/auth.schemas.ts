import { z } from "zod";

const fullNameSchema = z
  .string()
  .trim()
  .min(2, "Full name must contain at least 2 characters")
  .max(120, "Full name cannot exceed 120 characters");

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must contain at least 3 characters")
  .max(30, "Username cannot exceed 30 characters")
  .regex(
    /^[a-z0-9](?:[a-z0-9._]*[a-z0-9])?$/,
    "Use lowercase letters, numbers, dots and underscores only",
  );

const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .max(255, "Email address is too long");

const phoneNumberSchema = z
  .string()
  .trim()
  .regex(
    /^\+[1-9]\d{7,14}$/,
    "Use international format, for example +923001234567",
  );

const citySchema = z
  .string()
  .trim()
  .min(2, "City must contain at least 2 characters")
  .max(100, "City cannot exceed 100 characters")
  .regex(/^[\p{L}\p{M}\s.'-]+$/u, "City contains invalid characters");

const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .max(72, "Password cannot exceed 72 characters")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/\d/, "Password must contain a number")
  .regex(/[^A-Za-z0-9]/, "Password must contain a special character");

const profileImageSchema = z
  .instanceof(File, {
    message: "Profile image is required",
  })
  .refine((file) => file.type.startsWith("image/"), {
    message: "Select a valid image file",
  });

export const registerSchema = z
  .object({
    fullName: fullNameSchema,

    username: usernameSchema,

    email: emailSchema,

    phoneNumber: phoneNumberSchema,

    city: citySchema,

    gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]),

    password: passwordSchema,

    confirmPassword: z.string().min(1, "Confirm password is required"),

    profileImage: profileImageSchema,
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Password and confirm password do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, "Enter your email or username")
    .max(255, "Email or username is too long"),

  password: z
    .string()
    .min(1, "Password is required")
    .max(72, "Password cannot exceed 72 characters"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const verifyResetOtpSchema = z.object({
  email: emailSchema,

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the complete 6-digit verification code"),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,

    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Password and confirm password do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export type VerifyResetOtpFormValues = z.infer<typeof verifyResetOtpSchema>;

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
