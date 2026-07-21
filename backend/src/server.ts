import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

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

  server.close((error) => {
    if (error) {
      logger.error({ error }, "Server shutdown failed");
      process.exit(1);
    }

    logger.info("Server closed successfully");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
