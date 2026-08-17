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

// const shutdown = async (signal: string): Promise<void> => {
//   if (isShuttingDown) {
//     return;
//   }

//   isShuttingDown = true;

//   logger.info(
//     {
//       signal,
//     },
//     "Application shutdown started",
//   );

//   try {
//     await closeHttpServer();
//     await prisma.$disconnect();

//     logger.info("Application shutdown completed");

//     process.exitCode = 0;
//   } catch (error) {
//     logger.error(
//       {
//         err: error,
//       },
//       "Application shutdown failed",
//     );

//     process.exitCode = 1;
//   }
// };

// ✅ shutdown FUNCTION MEIN CHANGE KARO
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

  let exitCode = 0;

  // ✅ HTTP server close - ALWAYS try
  try {
    await closeHttpServer();
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "HTTP server close failed",
    );
    exitCode = 1;
  }

  // ✅ Database disconnect - ALWAYS try (even if HTTP close failed)
  try {
    await prisma.$disconnect();
    logger.info("PostgreSQL disconnected successfully");
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "Failed to disconnect from PostgreSQL",
    );
    exitCode = 1;
  }

  if (exitCode === 0) {
    logger.info("Application shutdown completed");
  } else {
    logger.error("Application shutdown completed with errors");
  }

  process.exitCode = exitCode;
  process.exit(exitCode);
};

process.once("SIGINT", () => {
  void shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  void shutdown("SIGTERM");
});

void startServer();
