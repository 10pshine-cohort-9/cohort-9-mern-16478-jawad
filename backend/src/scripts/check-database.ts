import { logger } from "../lib/logger.js";
import { prisma } from "../lib/prisma.js";

interface DatabaseInformation {
  database_name: string;
  database_user: string;
  database_version: string;
}

const checkDatabaseConnection = async (): Promise<void> => {
  try {
    const result = await prisma.$queryRaw<DatabaseInformation[]>`
      SELECT
        current_database() AS database_name,
        current_user AS database_user,
        version() AS database_version
    `;

    const databaseInformation = result[0];

    if (!databaseInformation) {
      throw new Error("PostgreSQL returned no database information");
    }

    logger.info(
      {
        database: databaseInformation.database_name,
        user: databaseInformation.database_user,
        version: databaseInformation.database_version,
      },
      "PostgreSQL connection verified successfully",
    );
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "PostgreSQL connection verification failed",
    );

    process.exitCode = 1;
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      logger.error(
        {
          err: disconnectError,
        },
        "Failed to disconnect from PostgreSQL",
      );

      process.exitCode = 1;
    }
  }
};

(async () => {
  try {
    await checkDatabaseConnection();
    process.exit(0);
  } catch (error) {
    logger.fatal({ err: error }, "Database check script failed");
    process.exitCode = 1;
    process.exit(1);
  }
})();