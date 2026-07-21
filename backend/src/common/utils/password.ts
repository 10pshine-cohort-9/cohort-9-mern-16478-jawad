import bcrypt from "bcrypt";

<<<<<<< HEAD
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
=======
import { env } from "../../config/env.js";

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
};

export const verifyPassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
<<<<<<< HEAD
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch (error) {
    throw new AppError("Password could not be verified", 500, {
      code: "PASSWORD_VERIFICATION_FAILED",
      cause: error,
    });
  }
=======
  return bcrypt.compare(password, passwordHash);
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
};
