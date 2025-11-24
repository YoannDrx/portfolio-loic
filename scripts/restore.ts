import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const BACKUP_DIR = path.join(process.cwd(), "data", "backup");

async function readBackup(modelName: string) {
  const filePath = path.join(BACKUP_DIR, `${modelName}.json`);
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.warn(`⚠️ Could not read backup for ${modelName} (File not found?), skipping.`);
    return [];
  }
}

async function main() {
  console.log("🌱 Starting Database Restore...");

  try {
    // READ DATA
    const users = await readBackup("users");
    const accounts = await readBackup("accounts");
    const settings = await readBackup("site_settings");
    const albums = await readBackup("albums");
    const videos = await readBackup("videos");
    const services = await readBackup("services");
    const resumeEntries = await readBackup("resume_entries");
    const navItems = await readBackup("navigation_items");

    console.log("🗑️  Cleaning database...");
    // DELETE in reverse order of dependencies
    await prisma.resumeEntry.deleteMany();
    await prisma.album.deleteMany();
    await prisma.video.deleteMany();
    await prisma.service.deleteMany();
    await prisma.navigationItem.deleteMany();
    await prisma.siteSettings.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
    console.log("   - Database cleared.");

    // RESTORE
    console.log("📦 Restoring data...");

    // 1. Users
    if (users.length > 0) {
      await prisma.user.createMany({ data: users });
      console.log(`   - Restored ${users.length} users`);
    }

    // 2. Accounts
    if (accounts.length > 0) {
      await prisma.account.createMany({ data: accounts });
      console.log(`   - Restored ${accounts.length} accounts`);
    }

    // 3. Site Settings
    if (settings.length > 0) {
      await prisma.siteSettings.createMany({ data: settings });
      console.log(`   - Restored ${settings.length} settings`);
    }

    // 4. Navigation Items
    if (navItems.length > 0) {
      await prisma.navigationItem.createMany({ data: navItems });
      console.log(`   - Restored ${navItems.length} nav items`);
    }

    // 5. Content
    if (albums.length > 0) {
      await prisma.album.createMany({ data: albums });
      console.log(`   - Restored ${albums.length} albums`);
    }

    if (videos.length > 0) {
      await prisma.video.createMany({ data: videos });
      console.log(`   - Restored ${videos.length} videos`);
    }

    if (services.length > 0) {
      await prisma.service.createMany({ data: services });
      console.log(`   - Restored ${services.length} services`);
    }

    if (resumeEntries.length > 0) {
      await prisma.resumeEntry.createMany({ data: resumeEntries });
      console.log(`   - Restored ${resumeEntries.length} resume entries`);
    }

    console.log("\n🎉 Restore completed successfully!");
  } catch (error) {
    console.error("❌ Restore failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();