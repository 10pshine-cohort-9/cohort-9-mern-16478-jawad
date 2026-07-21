
import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";

const server = app.listen(env.PORT, () => {
  logger.info(
    {
      port: env.PORT,
      environment: env.NODE_ENV,
    },
    "Notes App API server started",
  );
});

server.once("error", (error) => {
  logger.fatal(
    {
      error,
      port: env.PORT,
    },
    "Notes App API server failed to start",
  );

  process.exit(1);
});

let isShuttingDown = false;

const shutdown = (signal: string): void => {
  if (isShuttingDown) {
    logger.warn(
      {
        signal,
      },
      "Server shutdown is already in progress",
    );

    return;
  }

  isShuttingDown = true;

  logger.info(
    {
      signal,
    },
    "Server shutdown started",
  );

  server.close(async (error) => {
    if (error) {
      logger.error({ err: error }, "HTTP server shutdown failed");
      process.exit(1);
    }

    try {
      await prisma.$disconnect();

      logger.info("Database connection closed successfully");
      logger.info("Server shutdown completed successfully");

      process.exit(0);
    } catch (disconnectError) {
      logger.error(
        {
          err: disconnectError,
        },
        "Database disconnection failed",
      );

      process.exit(1);
    }
  });
};

process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

