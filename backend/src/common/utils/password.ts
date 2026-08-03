import bcrypt from "bcrypt";

import { AppError } from "../errors/app-error.js";
import { env } from "../../config/env.js";

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
  } catch (error) {
    throw new AppError("Password could not be secured", 500, {
      code: "PASSWORD_HASH_FAILED",
      cause: error,
    });
  }
};

export const verifyPassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch (error) {
    throw new AppError("Password could not be verified", 500, {
      code: "PASSWORD_VERIFICATION_FAILED",
      cause: error,
    });
  }
};
