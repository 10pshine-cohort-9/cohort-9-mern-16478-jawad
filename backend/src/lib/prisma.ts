import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "../config/env.js";
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

/**
 * Shared Prisma Client instance for application database access.
 *
 * Controllers must not query Prisma directly.
 * Database queries will be placed inside repository classes/functions.
 */
export const prisma = new PrismaClient({
  adapter,
});
