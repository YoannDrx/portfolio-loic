import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const BACKUP_DIR = path.join(process.cwd(), "data", "backup");

async function backupModel(modelName: string, data: any[]) {
  const filePath = path.join(BACKUP_DIR, `${modelName}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Backed up ${data.length} ${modelName} items to ${filePath}`);
}

async function main() {
  console.log("📦 Starting Database Backup...");

  try {
    // 1. Users
    const users = await prisma.user.findMany();
    await backupModel("users", users);

    // 1b. Accounts (Auth)
    const accounts = await prisma.account.findMany();
    await backupModel("accounts", accounts);

    // 2. Site Settings
    const settings = await prisma.siteSettings.findMany();
    await backupModel("site_settings", settings);

    // 3. Albums
    const albums = await prisma.album.findMany();
    await backupModel("albums", albums);

    // 4. Videos
    const videos = await prisma.video.findMany();
    await backupModel("videos", videos);

    // 5. Services
    const services = await prisma.service.findMany();
    await backupModel("services", services);

    // 6. Resume Entries
    const resumeEntries = await prisma.resumeEntry.findMany();
    await backupModel("resume_entries", resumeEntries);

    // 7. Navigation Items
    const navItems = await prisma.navigationItem.findMany();
    await backupModel("navigation_items", navItems);

    console.log("\n🎉 Backup completed successfully!");
  } catch (error) {
    console.error("❌ Backup failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
