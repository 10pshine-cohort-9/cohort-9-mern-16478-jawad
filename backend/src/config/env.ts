import "dotenv/config";

import { z } from "zod";

const booleanStringSchema = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

const postgresUrlSchema = z
  .string()
  .url("DATABASE_URL must be a valid URL")
  .refine(
    (value) => {
      const protocol = new URL(value).protocol;

      return protocol === "postgresql:" || protocol === "postgres:";
    },
    {
      message:
        "DATABASE_URL must use the postgresql:// or postgres:// protocol",
    },
  );

const isValidHttpOrigin = (value: string): boolean => {
  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    return url.pathname === "/" && url.search === "" && url.hash === "";
  } catch {
    return false;
  }
};

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().min(1).max(65_535).default(5000),

  CLIENT_URL: z.string().url().refine(isValidHttpOrigin, {
    message:
      "CLIENT_URL must be a valid HTTP or HTTPS origin without a path, query, hash, or credentials",
  }),

  DATABASE_URL: postgresUrlSchema,

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must contain at least 32 characters"),

  JWT_EXPIRES_IN: z
    .string()
    .regex(
      /^[1-9]\d*(s|m|h|d)$/,
      "JWT_EXPIRES_IN must be a positive duration such as 30m, 1h or 7d",
    )
    .default("7d"),
  JWT_ISSUER: z.string().default("notes-app-api"),

  JWT_AUDIENCE: z.string().default("notes-app-client"),

  COOKIE_NAME: z.string().default("notes_access_token"),

  AUTH_COOKIE_MAX_AGE_MS: z.coerce.number().int().positive().default(604800000),

  LOG_LEVEL: z.string().default("info"),

  MAX_PROFILE_IMAGE_SIZE_MB: z.coerce.number().positive().max(10).default(5),

  BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(10).max(14).default(12),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  MAIL_ENABLED: booleanStringSchema,

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: booleanStringSchema,
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  MAIL_FROM_NAME: z.string().default("Notes App"),
  MAIL_FROM_EMAIL: z.string().email().optional(),

  PASSWORD_RESET_SECRET: z
    .string()
    .min(32, "PASSWORD_RESET_SECRET must contain at least 32 characters"),

  PASSWORD_RESET_OTP_TTL_MINUTES: z.coerce
    .number()
    .int()
    .min(5)
    .max(30)
    .default(10),

  PASSWORD_RESET_TOKEN_TTL_MINUTES: z.coerce
    .number()
    .int()
    .min(5)
    .max(30)
    .default(10),

  PASSWORD_RESET_MAX_ATTEMPTS: z.coerce
    .number()
    .int()
    .min(3)
    .max(10)
    .default(5),

  PASSWORD_RESET_COOKIE_NAME: z.string().default("notes_password_reset_token"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment variables:");
  console.error(
    result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    })),
  );

  process.exit(1);
}

if (
  result.data.MAIL_ENABLED &&
  (!result.data.SMTP_HOST ||
    !result.data.SMTP_USER ||
    !result.data.SMTP_PASS ||
    !result.data.MAIL_FROM_EMAIL)
) {
  console.error("Email is enabled but SMTP configuration is incomplete.");

  process.exit(1);
}

export const env = result.data;
