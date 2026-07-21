<<<<<<< HEAD
=======
import type { Server } from "node:http";
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)

import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";

let server: Server | undefined;

<<<<<<< HEAD
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
=======
const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)

    logger.info("PostgreSQL connection established");

    server = app.listen(env.PORT, () => {
      logger.info(
        {
          port: env.PORT,
          environment: env.NODE_ENV,
        },
        "Notes App API server started",
      );
    });
  } catch (error) {
    logger.fatal({ err: error }, "Application startup failed");

    await prisma.$disconnect().catch(() => undefined);
    process.exit(1);
  }
};

<<<<<<< HEAD
process.on("SIGINT", () => {
  shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});

=======
const shutdown = async (signal: string): Promise<void> => {
  logger.info({ signal }, "Application shutdown started");

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await prisma.$disconnect();

    logger.info("Application shutdown completed");
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, "Application shutdown failed");

    process.exit(1);
  }
};

process.once("SIGINT", () => {
  void shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  void shutdown("SIGTERM");
});

void startServer();
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
