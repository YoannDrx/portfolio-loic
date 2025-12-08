/**
 * Production Migration Script
 *
 * Applies pending migrations to the production database (Neon).
 * This script explicitly loads .env (not .env.local) for safety.
 *
 * Usage: yarn db:migrate:prod
 */

import { execSync } from "child_process";
import readline from "readline";
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
  logger.error("This script is for production only. Use 'yarn db:migrate' for development.");
  process.exit(1);
}

async function confirmAction(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      "\n⚠️  You are about to apply migrations to PRODUCTION.\n" +
        "   This action cannot be undone.\n" +
        "   Type 'yes' to confirm: ",
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "yes");
      }
    );
  });
}

async function main() {
  logger.info(`Target: ${maskDbUrl(process.env.DATABASE_URL!)}`);

  // Skip confirmation if --yes flag is passed
  if (!process.argv.includes("--yes")) {
    const confirmed = await confirmAction();
    if (!confirmed) {
      logger.warn("Operation cancelled.");
      process.exit(0);
    }
  }

  logger.step("Applying migrations to production...");

  try {
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      env: process.env,
    });
    logger.success("Production migrations applied successfully!");
  } catch (error) {
    logger.error("Migration failed");
    process.exit(1);
  }
}

main();
