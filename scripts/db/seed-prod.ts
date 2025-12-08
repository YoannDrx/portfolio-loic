/**
 * Production Seed Script
 *
 * Seeds the production database (Neon) in additive mode.
 * This script explicitly loads .env (not .env.local) for safety.
 *
 * Usage: yarn db:seed:prod
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
  logger.error("This script is for production only. Use 'yarn db:seed' for development.");
  process.exit(1);
}

logger.info(`Target: ${maskDbUrl(process.env.DATABASE_URL!)}`);
logger.warn("You are about to seed the PRODUCTION database.");

// Run the seed script
logger.step("Running seed in additive mode...");

try {
  execSync("tsx seed/index.ts", {
    stdio: "inherit",
    env: process.env,
  });
  logger.success("Production seed completed!");
} catch (error) {
  logger.error("Production seed failed");
  process.exit(1);
}
