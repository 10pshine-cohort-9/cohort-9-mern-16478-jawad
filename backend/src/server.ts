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

const shutdown = (signal: string): void => {
  logger.info({ signal }, "Server shutdown started");

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

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
