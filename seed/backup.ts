import { PrismaClient } from "@prisma/client";
import path from "path";
import { logger, saveJSON, getTimestamp, BACKUPS_DIR, DATA_DIR } from "./utils";

const prisma = new PrismaClient();

interface BackupOptions {
  timestamped?: boolean; // true = backup horodaté, false = écrase seed/data/
}

async function backup(options: BackupOptions = { timestamped: true }) {
  const timestamp = getTimestamp();
  const backupDir = options.timestamped ? path.join(BACKUPS_DIR, timestamp) : DATA_DIR;

  logger.title(
    options.timestamped ? `📦 Backup horodaté → ${timestamp}` : "📦 Backup vers seed/data/"
  );

  try {
    // 1. Users
    const users = await prisma.user.findMany();
    await saveJSON("users", users, backupDir);
    logger.count("users", users.length);

    // 2. Accounts
    const accounts = await prisma.account.findMany();
    await saveJSON("accounts", accounts, backupDir);
    logger.count("accounts", accounts.length);

    // 3. Site Settings
    const settings = await prisma.siteSettings.findMany();
    await saveJSON("site_settings", settings, backupDir);
    logger.count("site_settings", settings.length);

    // 4. Navigation Items
    const navItems = await prisma.navigationItem.findMany();
    await saveJSON("navigation_items", navItems, backupDir);
    logger.count("navigation_items", navItems.length);

    // 5. Albums
    const albums = await prisma.album.findMany({
      orderBy: { order: "asc" },
    });
    await saveJSON("albums", albums, backupDir);
    logger.count("albums", albums.length);

    // 6. Videos
    const videos = await prisma.video.findMany({
      orderBy: { order: "asc" },
    });
    await saveJSON("videos", videos, backupDir);
    logger.count("videos", videos.length);

    // 7. Services
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
    await saveJSON("services", services, backupDir);
    logger.count("services", services.length);

    // 8. Resume Entries
    const resumeEntries = await prisma.resumeEntry.findMany({
      orderBy: { order: "asc" },
    });
    await saveJSON("resume_entries", resumeEntries, backupDir);
    logger.count("resume_entries", resumeEntries.length);

    // 9. Resume Profile (si existe)
    try {
      const resumeProfile = await prisma.resumeProfile.findMany();
      if (resumeProfile.length > 0) {
        await saveJSON("resume_profile", resumeProfile, backupDir);
        logger.count("resume_profile", resumeProfile.length);
      }
    } catch {
      // Model peut ne pas exister
    }

    // 10. Resume Theme (si existe)
    try {
      const resumeTheme = await prisma.resumeTheme.findMany();
      if (resumeTheme.length > 0) {
        await saveJSON("resume_theme", resumeTheme, backupDir);
        logger.count("resume_theme", resumeTheme.length);
      }
    } catch {
      // Model peut ne pas exister
    }

    // 11. Resume Sections (si existe)
    try {
      const resumeSections = await prisma.resumeSection.findMany();
      if (resumeSections.length > 0) {
        await saveJSON("resume_sections", resumeSections, backupDir);
        logger.count("resume_sections", resumeSections.length);
      }
    } catch {
      // Model peut ne pas exister
    }

    // 12. CV complet avec toutes les relations
    try {
      const cvs = await prisma.cV.findMany({
        include: {
          sections: {
            include: {
              translations: true,
              items: {
                include: { translations: true },
              },
            },
            orderBy: { order: "asc" },
          },
          skills: {
            include: { translations: true },
            orderBy: { order: "asc" },
          },
          socialLinks: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (cvs.length > 0) {
        // Transformer en structure plate compatible avec le seeder
        const cvData = cvs.map((cv) => ({
          cv: {
            id: cv.id,
            isActive: cv.isActive,
            fullName: cv.fullName,
            badgeFr: cv.badgeFr,
            badgeEn: cv.badgeEn,
            photo: cv.photo,
            phone: cv.phone,
            email: cv.email,
            website: cv.website,
            location: cv.location,
            linkedInUrl: cv.linkedInUrl,
            headlineFr: cv.headlineFr,
            headlineEn: cv.headlineEn,
            bioFr: cv.bioFr,
            bioEn: cv.bioEn,
            layout: cv.layout,
            accentColor: cv.accentColor,
            showPhoto: cv.showPhoto,
            theme: cv.theme,
            createdAt: cv.createdAt,
            updatedAt: cv.updatedAt,
          },
          sections: cv.sections.map((section) => ({
            id: section.id,
            type: section.type,
            icon: section.icon,
            color: section.color,
            placement: section.placement,
            layoutType: section.layoutType,
            order: section.order,
            isActive: section.isActive,
            translations: section.translations,
            items: section.items.map((item) => ({
              id: item.id,
              startDate: item.startDate,
              endDate: item.endDate,
              isCurrent: item.isCurrent,
              order: item.order,
              isActive: item.isActive,
              translations: item.translations,
            })),
          })),
          skills: cv.skills.map((skill) => ({
            id: skill.id,
            category: skill.category,
            level: skill.level,
            showAsBar: skill.showAsBar,
            order: skill.order,
            isActive: skill.isActive,
            translations: skill.translations,
          })),
          socialLinks: cv.socialLinks.map((link) => ({
            id: link.id,
            platform: link.platform,
            url: link.url,
            label: link.label,
            order: link.order,
          })),
        }));

        // Sauvegarder comme un seul objet (le premier CV actif)
        await saveJSON("cv", cvData[0] ? [cvData[0]] : [], backupDir);
        logger.count("cv (avec sections/skills/links)", cvs.length);
      }
    } catch (error) {
      logger.warn(`Backup CV échoué: ${error}`);
    }

    logger.success(
      options.timestamped
        ? `Backup créé dans seed/backups/${timestamp}/`
        : "Backup créé dans seed/data/"
    );

    return timestamp;
  } catch (error) {
    logger.error(`Backup échoué: ${error}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution directe
const isTimestamped = !process.argv.includes("--overwrite");
backup({ timestamped: isTimestamped });
