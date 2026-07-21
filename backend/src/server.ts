import type { Server } from "node:http";

import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";

let server: Server | undefined;

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();

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
