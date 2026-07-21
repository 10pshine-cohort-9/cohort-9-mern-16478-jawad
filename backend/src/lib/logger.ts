import pino from "pino";

import { env } from "../config/env.js";

export const logger = pino({
  level: env.LOG_LEVEL,

  redact: {
    paths: [
      "password",
      "confirmPassword",
      "*.password",
      "*.confirmPassword",
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers.set-cookie"
    ],
    censor: "[REDACTED]"
  },

  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname"
          }
        }
      : undefined
});