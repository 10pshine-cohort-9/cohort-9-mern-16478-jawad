import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce.number().int().positive().default(5000),

  CLIENT_URL: z.string().url(),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must contain at least 32 characters"),

  JWT_EXPIRES_IN: z.string().default("7d"),

  COOKIE_NAME: z.string().default("notes_access_token"),

  LOG_LEVEL: z.string().default("info"),

  PROFILE_UPLOAD_DIR: z.string().default("uploads/profiles"),

  MAX_PROFILE_IMAGE_SIZE_MB: z.coerce.number().positive().default(5)
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment variables:");

  console.error(
    result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }))
  );

  process.exit(1);
}

export const env = result.data;