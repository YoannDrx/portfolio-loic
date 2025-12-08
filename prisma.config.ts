/**
 * Prisma Configuration
 *
 * This file configures Prisma to load environment variables correctly:
 * - In CI/Vercel: Uses process.env.DATABASE_URL (set by the platform)
 * - In development: Uses .env.local first, then .env (like Next.js)
 * - In production scripts: Uses .env only
 */

import fs from "fs";
import path from "path";
import { defineConfig } from "prisma/config";

/**
 * Get an environment variable with proper fallback logic.
 * Priority: process.env > .env.local > .env
 */
function getEnvVar(name: string): string | undefined {
  // 1. Check process.env first (set by CI, Vercel, or explicit)
  if (process.env[name]) {
    return process.env[name];
  }

  const cwd = process.cwd();

  // 2. Try .env.local (development priority)
  const localPath = path.join(cwd, ".env.local");
  if (fs.existsSync(localPath)) {
    const value = extractVarFromFile(localPath, name);
    if (value) return value;
  }

  // 3. Fallback to .env
  const envPath = path.join(cwd, ".env");
  if (fs.existsSync(envPath)) {
    const value = extractVarFromFile(envPath, name);
    if (value) return value;
  }

  return undefined;
}

/**
 * Extract a variable from an env file
 */
function extractVarFromFile(filePath: string, varName: string): string | undefined {
  try {
    const content = fs.readFileSync(filePath, "utf-8");

    for (const line of content.split("\n")) {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith("#")) continue;

      // Check if this line starts with our variable
      if (!trimmed.startsWith(`${varName}=`)) continue;

      // Extract value after the =
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;

      let value = trimmed.slice(eqIndex + 1).trim();

      // Remove surrounding quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      return value;
    }
  } catch {
    // File read error, return undefined
  }

  return undefined;
}

const databaseUrl = getEnvVar("DATABASE_URL");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl ?? "",
  },
});
