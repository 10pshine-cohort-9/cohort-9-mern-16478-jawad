import { randomUUID } from "node:crypto";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { pinoHttp } from "pino-http";

import { globalErrorHandler } from "./common/middleware/error.middleware.js";
import { notFoundHandler } from "./common/middleware/not-found.middleware.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

export const app = express();

/**
 * Do not reveal Express through the X-Powered-By response header.
 */
app.disable("x-powered-by");

/**
 * HTTP logger is registered first so that it measures the complete
 * request-response lifecycle.
 */
app.use(
  pinoHttp({
    logger,

    genReqId: (request, response) => {
      const incomingRequestId = request.headers["x-request-id"];

      const requestId =
        typeof incomingRequestId === "string" &&
        incomingRequestId.trim().length > 0
          ? incomingRequestId.trim()
          : randomUUID();

      response.setHeader("X-Request-Id", requestId);

      return requestId;
    },

    customLogLevel: (_request, response, error) => {
      if (error || response.statusCode >= 500) {
        return "error";
      }

      if (response.statusCode >= 400) {
        return "warn";
      }

      return "info";
    },
  }),
);

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/v1/health", (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Notes App API is healthy",
    data: {
      status: "UP",
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * Application routes will be registered above this line.
 *
 * Examples:
 * app.use("/api/v1/auth", authRouter);
 * app.use("/api/v1/notes", noteRouter);
 */

/**
 * These handlers must remain at the end.
 */
app.use(notFoundHandler);
app.use(globalErrorHandler);
