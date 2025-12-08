/**
 * Production Migration Status Script
 *
 * Shows the status of migrations on the production database (Neon).
 * This is a read-only operation.
 *
 * Usage: yarn db:status:prod
 */

import { execSync } from "child_process";
import { loadEnv, validateEnv, isNeonUrl, maskDbUrl, logger } from "./utils";

// Force production environment
loadEnv("production");

// Validate
if (!validateEnv(["DATABASE_URL"])) {
  process.exit(1);
}

// Safety check: ensure we're targeting Neon
if (!isNeonUrl()) {
  logger.error("DATABASE_URL does not point to Neon (production)");
  process.exit(1);
}

logger.info(`Target: ${maskDbUrl(process.env.DATABASE_URL!)}`);
logger.step("Checking migration status...");

try {
  execSync("npx prisma migrate status", {
    stdio: "inherit",
    env: process.env,
  });
} catch (error) {
  // prisma migrate status returns exit code 1 if there are pending migrations
  // This is not an error, just information
  logger.warn("There may be pending migrations.");
}
