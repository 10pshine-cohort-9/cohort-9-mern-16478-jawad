import {
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from "node:crypto";

import { env } from "../../config/env.js";

const hashValue = (purpose: "otp" | "reset-token", value: string): string => {
  return createHmac("sha256", env.PASSWORD_RESET_SECRET)
    .update(`${purpose}:${value}`)
    .digest("hex");
};

const safelyCompareHashes = (
  actualHash: string,
  expectedHash: string,
): boolean => {
  const actualBuffer = Buffer.from(actualHash, "hex");

  const expectedBuffer = Buffer.from(expectedHash, "hex");

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
};

export const generatePasswordResetOtp = (): string => {
  return randomInt(100_000, 1_000_000).toString();
};

export const hashPasswordResetOtp = (otp: string): string => {
  return hashValue("otp", otp);
};

export const verifyPasswordResetOtpHash = (
  otp: string,
  storedHash: string,
): boolean => {
  return safelyCompareHashes(hashPasswordResetOtp(otp), storedHash);
};

export const generatePasswordResetToken = (): string => {
  return randomBytes(32).toString("hex");
};

export const hashPasswordResetToken = (token: string): string => {
  return hashValue("reset-token", token);
};
