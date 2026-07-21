import { once } from "node:events";
import type { Server } from "node:http";

import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";

let server: Server | undefined;
let isShuttingDown = false;

const closeHttpServer = async (): Promise<void> => {
  if (!server || !server.listening) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    server?.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
};

const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "Failed to disconnect from PostgreSQL",
    );
  }
};

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();

    logger.info("PostgreSQL connection established");

    server = app.listen(env.PORT);

    /*
     * Wait until the server has successfully bound
     * to the configured port. The promise rejects
     * automatically if the server emits an error.
     */
    await once(server, "listening");

    logger.info(
      {
        port: env.PORT,
        environment: env.NODE_ENV,
      },
      "Notes App API server started",
    );
  } catch (error) {
    logger.fatal(
      {
        err: error,
        port: env.PORT,
      },
      "Application startup failed",
    );

    try {
      await closeHttpServer();
    } catch (closeError) {
      logger.error(
        {
          err: closeError,
        },
        "Failed to close HTTP server after startup error",
      );
    }

    await disconnectDatabase();

    process.exitCode = 1;
  }
};

const shutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info(
    {
      signal,
    },
    "Application shutdown started",
  );

  try {
    await closeHttpServer();
    await prisma.$disconnect();

    logger.info("Application shutdown completed");

    process.exitCode = 0;
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "Application shutdown failed",
    );

    process.exitCode = 1;
  }
};

process.once("SIGINT", () => {
  void shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  void shutdown("SIGTERM");
});

void startServer();
