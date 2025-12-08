/**
 * Vercel Build Script
 *
 * Ce script est exécuté automatiquement par Vercel lors du déploiement.
 * Il applique les migrations, génère le client Prisma, seed la base (mode additif),
 * puis build l'application Next.js.
 *
 * Usage: yarn vercel-build (configuré dans package.json)
 */

const { execSync } = require("child_process");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(emoji, message, color = colors.reset) {
  console.log(`${color}${emoji} ${message}${colors.reset}`);
}

function run(cmd, description) {
  log("🔄", `${description}...`, colors.cyan);
  try {
    execSync(cmd, { stdio: "inherit" });
    log("✅", `${description} completed`, colors.green);
    return true;
  } catch (error) {
    log("❌", `${description} failed`, colors.red);
    return false;
  }
}

function maskUrl(url) {
  if (!url) return "[not set]";
  return url.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
}

// ============================================
// MAIN PIPELINE
// ============================================

console.log("\n" + "=".repeat(60));
log("🚀", "Vercel Build Pipeline Starting", colors.blue);
console.log("=".repeat(60) + "\n");

// Validate environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  log("❌", "DATABASE_URL is required", colors.red);
  log("💡", "Set DATABASE_URL in Vercel environment variables", colors.yellow);
  process.exit(1);
}

log("📡", `Database: ${maskUrl(databaseUrl)}`, colors.cyan);
console.log("");

// Step 1: Apply migrations
if (!run("npx prisma migrate deploy", "Applying database migrations")) {
  log("💡", "Check your migrations and DATABASE_URL", colors.yellow);
  process.exit(1);
}

console.log("");

// Step 2: Generate Prisma client
if (!run("npx prisma generate", "Generating Prisma client")) {
  process.exit(1);
}

console.log("");

// Step 3: Seed database (additive mode - only creates missing entities)
// Skip if SKIP_SEED=true is set
if (process.env.SKIP_SEED === "true") {
  log("⏭️", "Skipping seed (SKIP_SEED=true)", colors.yellow);
} else {
  // Le seed en mode additif ne crée que les entités manquantes
  if (!run("yarn db:seed", "Seeding database (additive mode)")) {
    log("⚠️", "Seed failed but continuing with build...", colors.yellow);
    // On ne quitte pas - le seed peut échouer si les données existent déjà
  }
}

console.log("");

// Step 4: Build Next.js application
if (!run("yarn build", "Building Next.js application")) {
  process.exit(1);
}

console.log("\n" + "=".repeat(60));
log("🎉", "Build pipeline completed successfully!", colors.green);
console.log("=".repeat(60) + "\n");
