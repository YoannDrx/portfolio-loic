import fs from "fs/promises";
import path from "path";

// === COULEURS POUR LES LOGS CLI ===
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

/* eslint-disable no-console */
// Logger CLI avec couleurs pour les scripts de seeding
export const logger = {
  success: (msg: string) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  warn: (msg: string) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ️${colors.reset} ${msg}`),
  step: (msg: string) => console.log(`${colors.cyan}→${colors.reset} ${msg}`),
  title: (msg: string) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}\n`),
  count: (entity: string, count: number) =>
    console.log(
      `   ${colors.gray}└─${colors.reset} ${entity}: ${colors.green}${count}${colors.reset}`
    ),
};
/* eslint-enable no-console */

// === CHEMINS ===
export const SEED_DIR = path.join(process.cwd(), "seed");
export const DATA_DIR = path.join(SEED_DIR, "data");
export const BACKUPS_DIR = path.join(SEED_DIR, "backups");

// === CHARGEMENT JSON ===
export async function loadJSON<T>(filename: string): Promise<T[]> {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    logger.warn(`Fichier ${filename}.json non trouvé, retour tableau vide`);
    return [];
  }
}

// === SAUVEGARDE JSON ===
export async function saveJSON(
  filename: string,
  data: unknown[],
  dir: string = DATA_DIR
): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `${filename}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// === TIMESTAMP POUR BACKUPS ===
export function getTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
}

// === TRANSFORMATION DES DATES ISO → Date ===
export function transformDates<T extends Record<string, unknown>>(data: T[]): T[] {
  const dateFields = [
    "createdAt",
    "updatedAt",
    "startDate",
    "endDate",
    "expiresAt",
    "emailVerified",
  ];

  return data.map((item) => {
    const transformed = { ...item };
    for (const field of dateFields) {
      if (field in transformed && transformed[field] && typeof transformed[field] === "string") {
        (transformed as Record<string, unknown>)[field] = new Date(transformed[field] as string);
      }
    }
    return transformed;
  });
}

// === PARSING DES ARGUMENTS CLI ===
export interface ParsedArgs {
  only?: string;
  force: boolean;
  overwrite: boolean;
  yes: boolean;
}

export function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);
  const onlyArg = args.find((arg) => arg.startsWith("--only="));
  return {
    only: onlyArg?.split("=")[1],
    force: args.includes("--force"),
    overwrite: args.includes("--overwrite"),
    yes: args.includes("--yes"),
  };
}

// === ORDRE DE SEEDING (respect des FK) ===
export const SEED_ORDER = [
  "users",
  "accounts",
  "site_settings",
  "navigation_items",
  "albums",
  "videos",
  "services",
  "resume_entries",
  "cv",
] as const;

// === ORDRE DE SUPPRESSION (inverse pour FK) ===
export const CLEAN_ORDER = [
  "contentVersion",
  "cVVersion",
  "cVSocialLink",
  "cVSkillTranslation",
  "cVSkill",
  "cVItemTranslation",
  "cVItem",
  "cVSectionTranslation",
  "cVSection",
  "cV",
  "resumeSection",
  "resumeEntry",
  "resumeTheme",
  "resumeProfile",
  "service",
  "video",
  "album",
  "navigationItem",
  "siteSettings",
  "session",
  "verification",
  "account",
  "user",
] as const;

export type SeedEntity = (typeof SEED_ORDER)[number];
