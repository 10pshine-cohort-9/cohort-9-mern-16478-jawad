import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

import { env } from "../../config/env.js";

const getSignOptions = (userId: string): SignOptions => {
  return {
    algorithm: "HS256",
    subject: userId,
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };
};

export const createAccessToken = (userId: string): string => {
  return jwt.sign({}, env.JWT_SECRET, getSignOptions(userId));
};

export const verifyAccessToken = (token: string): string => {
  const decoded = jwt.verify(token, env.JWT_SECRET, {
    algorithms: ["HS256"],
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  });

  if (
    typeof decoded === "string" ||
    typeof (decoded as JwtPayload).sub !== "string"
  ) {
    throw new Error("Access token subject is missing");
  }

  return (decoded as JwtPayload).sub as string;
};
