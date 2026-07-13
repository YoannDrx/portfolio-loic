import type { Prisma } from "@prisma/client";
import { createPrismaClient } from "../lib/prisma-client";
import type { SeedEntity } from "./utils";
import { logger, loadJSON, transformDates, parseArgs, SEED_ORDER } from "./utils";

const prisma = createPrismaClient();

// Compteurs globaux pour le rapport final
let createdCount = 0;
let updatedCount = 0;
let skippedCount = 0;

// === SEEDERS PAR ENTITÉ ===
const seeders: Record<SeedEntity, () => Promise<number>> = {
  users: async () => {
    const data = await loadJSON<Record<string, unknown>>("users");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prisma.user.createMany({ data: transformed as any, skipDuplicates: true });
    return data.length;
  },

  accounts: async () => {
    const data = await loadJSON<Record<string, unknown>>("accounts");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await prisma.account.createMany({ data: transformed as any, skipDuplicates: true });
    return data.length;
  },

  site_settings: async () => {
    const data = await loadJSON<Record<string, unknown>>("site_settings");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    for (const item of transformed) {
      await prisma.siteSettings.upsert({
        where: { id: (item as { id: string }).id },
        update: item as Record<string, unknown>,
        create: item as Record<string, unknown>,
      });
    }
    return data.length;
  },

  navigation_items: async () => {
    const data = await loadJSON<Record<string, unknown>>("navigation_items");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    await prisma.navigationItem.createMany({
      data: transformed as Prisma.NavigationItemCreateManyInput[],
      skipDuplicates: true,
    });
    return data.length;
  },

  albums: async () => {
    const { force } = parseArgs();
    const data = await loadJSON<Record<string, unknown>>("albums");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    let localCreated = 0;

    for (const item of transformed) {
      const { tracks = [], ...albumData } = item as {
        id: string;
        tracks?: Prisma.AlbumTrackCreateWithoutAlbumInput[];
      } & Record<string, unknown>;
      const existing = await prisma.album.findUnique({ where: { id: albumData.id } });

      if (!existing) {
        await prisma.album.create({
          data: {
            ...(albumData as Parameters<typeof prisma.album.create>[0]["data"]),
            tracks: { create: tracks },
          },
        });
        localCreated++;
        createdCount++;
      } else if (force) {
        await prisma.album.update({
          where: { id: albumData.id },
          data: {
            ...(albumData as Parameters<typeof prisma.album.update>[0]["data"]),
            tracks: { deleteMany: {}, create: tracks },
          },
        });
        updatedCount++;
      } else {
        // Slugs and verified tracklists are safe additive enrichments and must
        // also reach existing production albums without overwriting copy.
        await prisma.album.update({
          where: { id: albumData.id },
          data: {
            slug: albumData.slug as string | undefined,
            img: albumData.img as string,
            releaseDate: albumData.releaseDate as Date | undefined,
            releaseType: albumData.releaseType as string | undefined,
            label: albumData.label as string | undefined,
            publisher: albumData.publisher as string | undefined,
            tracklistSourceUrl: albumData.tracklistSourceUrl as string | undefined,
            tracklistVerifiedAt: albumData.tracklistVerifiedAt as Date | undefined,
            ...(["new_k_style_2026", "new_obsession_2026", "cmi93hkby0000sks6h3gh5j7i"].includes(
              albumData.id
            )
              ? {
                  collabName: albumData.collabName as string | undefined,
                  descriptionsFr: albumData.descriptionsFr as string,
                  descriptionsEn: albumData.descriptionsEn as string,
                }
              : {}),
            tracks: { deleteMany: {}, create: tracks },
          },
        });
        skippedCount++;
      }
    }
    return localCreated;
  },

  videos: async () => {
    const { force } = parseArgs();
    const data = await loadJSON<Record<string, unknown>>("videos");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    let localCreated = 0;

    for (const item of transformed) {
      const videoData = item as { id: string } & Record<string, unknown>;
      const existing = await prisma.video.findUnique({ where: { id: videoData.id } });

      if (!existing) {
        await prisma.video.create({
          data: videoData as Parameters<typeof prisma.video.create>[0]["data"],
        });
        localCreated++;
        createdCount++;
      } else if (force) {
        await prisma.video.update({
          where: { id: videoData.id },
          data: videoData as Parameters<typeof prisma.video.update>[0]["data"],
        });
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
    return localCreated;
  },

  services: async () => {
    const { force } = parseArgs();
    const data = await loadJSON<Record<string, unknown>>("services");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    let localCreated = 0;

    for (const item of transformed) {
      const serviceData = item as { id: string } & Record<string, unknown>;
      const existing = await prisma.service.findUnique({ where: { id: serviceData.id } });

      if (!existing) {
        await prisma.service.create({
          data: serviceData as Parameters<typeof prisma.service.create>[0]["data"],
        });
        localCreated++;
        createdCount++;
      } else if (force) {
        await prisma.service.update({
          where: { id: serviceData.id },
          data: serviceData as Parameters<typeof prisma.service.update>[0]["data"],
        });
        updatedCount++;
      } else {
        if (serviceData.slug) {
          await prisma.service.update({
            where: { id: serviceData.id },
            data: { slug: serviceData.slug as string },
          });
        }
        skippedCount++;
      }
    }
    return localCreated;
  },

  resume_entries: async () => {
    const { force } = parseArgs();
    const data = await loadJSON<Record<string, unknown>>("resume_entries");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    let localCreated = 0;

    for (const item of transformed) {
      const entryData = item as { id: string } & Record<string, unknown>;
      const existing = await prisma.resumeEntry.findUnique({ where: { id: entryData.id } });

      if (!existing) {
        await prisma.resumeEntry.create({
          data: entryData as Parameters<typeof prisma.resumeEntry.create>[0]["data"],
        });
        localCreated++;
        createdCount++;
      } else if (force) {
        await prisma.resumeEntry.update({
          where: { id: entryData.id },
          data: entryData as Parameters<typeof prisma.resumeEntry.update>[0]["data"],
        });
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
    return localCreated;
  },

  cv: async () => {
    const fs = await import("fs/promises");
    const path = await import("path");
    const filePath = path.join(process.cwd(), "seed/data/cv.json");

    try {
      const raw = await fs.readFile(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      const data = Array.isArray(parsed) ? parsed[0] : parsed;
      if (!data?.cv) return 0;

      // Créer ou mettre à jour le CV principal
      const cvData = {
        id: data.cv.id,
        isActive: data.cv.isActive ?? true,
        fullName: data.cv.fullName,
        badgeFr: data.cv.badgeFr,
        badgeEn: data.cv.badgeEn,
        photo: data.cv.photo,
        phone: data.cv.phone,
        email: data.cv.email,
        website: data.cv.website,
        location: data.cv.location,
        linkedInUrl: data.cv.linkedInUrl,
        headlineFr: data.cv.headlineFr,
        headlineEn: data.cv.headlineEn,
        bioFr: data.cv.bioFr,
        bioEn: data.cv.bioEn,
        layout: data.cv.layout ?? "creative",
        accentColor: data.cv.accentColor ?? "#D5FF0A",
        showPhoto: data.cv.showPhoto ?? true,
        theme: data.cv.theme ?? null,
      };

      await prisma.cV.upsert({
        where: { id: data.cv.id },
        update: cvData,
        create: cvData,
      });

      let count = 1;

      // Créer les sections avec leurs items
      if (data.sections && Array.isArray(data.sections)) {
        for (const section of data.sections) {
          // Créer la section
          await prisma.cVSection.upsert({
            where: { id: section.id },
            update: {
              cvId: data.cv.id,
              type: section.type,
              icon: section.icon,
              color: section.color,
              placement: section.placement ?? "main",
              layoutType: section.layoutType ?? "list",
              order: section.order ?? 0,
              isActive: section.isActive ?? true,
            },
            create: {
              id: section.id,
              cvId: data.cv.id,
              type: section.type,
              icon: section.icon,
              color: section.color,
              placement: section.placement ?? "main",
              layoutType: section.layoutType ?? "list",
              order: section.order ?? 0,
              isActive: section.isActive ?? true,
            },
          });
          count++;

          // Créer les traductions de section
          if (section.translations) {
            for (const trans of section.translations) {
              await prisma.cVSectionTranslation.upsert({
                where: {
                  sectionId_locale: { sectionId: section.id, locale: trans.locale },
                },
                update: { title: trans.title },
                create: {
                  sectionId: section.id,
                  locale: trans.locale,
                  title: trans.title,
                },
              });
            }
          }

          // Créer les items de section
          if (section.items && Array.isArray(section.items)) {
            for (const [idx, item] of section.items.entries()) {
              const itemId = item.id || `${section.id}_item_${item.order ?? idx}`;

              await prisma.cVItem.upsert({
                where: { id: itemId },
                update: {
                  sectionId: section.id,
                  startDate: item.startDate ? new Date(item.startDate) : null,
                  endDate: item.endDate ? new Date(item.endDate) : null,
                  isCurrent: item.isCurrent ?? false,
                  order: item.order ?? 0,
                  isActive: item.isActive ?? true,
                },
                create: {
                  id: itemId,
                  sectionId: section.id,
                  startDate: item.startDate ? new Date(item.startDate) : null,
                  endDate: item.endDate ? new Date(item.endDate) : null,
                  isCurrent: item.isCurrent ?? false,
                  order: item.order ?? 0,
                  isActive: item.isActive ?? true,
                },
              });
              count++;

              // Créer les traductions d'item
              if (item.translations) {
                for (const trans of item.translations) {
                  await prisma.cVItemTranslation.upsert({
                    where: {
                      itemId_locale: { itemId, locale: trans.locale },
                    },
                    update: {
                      title: trans.title,
                      subtitle: trans.subtitle,
                      location: trans.location,
                      description: trans.description,
                    },
                    create: {
                      itemId,
                      locale: trans.locale,
                      title: trans.title,
                      subtitle: trans.subtitle,
                      location: trans.location,
                      description: trans.description,
                    },
                  });
                }
              }
            }
          }
        }
      }

      // Créer les skills
      if (data.skills && Array.isArray(data.skills)) {
        for (const skill of data.skills) {
          await prisma.cVSkill.upsert({
            where: { id: skill.id },
            update: {
              cvId: data.cv.id,
              category: skill.category,
              level: skill.level ?? 3,
              showAsBar: skill.showAsBar ?? true,
              order: skill.order ?? 0,
              isActive: skill.isActive ?? true,
            },
            create: {
              id: skill.id,
              cvId: data.cv.id,
              category: skill.category,
              level: skill.level ?? 3,
              showAsBar: skill.showAsBar ?? true,
              order: skill.order ?? 0,
              isActive: skill.isActive ?? true,
            },
          });
          count++;

          // Créer les traductions de skill
          if (skill.translations) {
            for (const trans of skill.translations) {
              await prisma.cVSkillTranslation.upsert({
                where: {
                  skillId_locale: { skillId: skill.id, locale: trans.locale },
                },
                update: { name: trans.name },
                create: {
                  skillId: skill.id,
                  locale: trans.locale,
                  name: trans.name,
                },
              });
            }
          }
        }
      }

      // Créer les social links
      if (data.socialLinks && Array.isArray(data.socialLinks)) {
        for (const link of data.socialLinks) {
          await prisma.cVSocialLink.upsert({
            where: { id: link.id },
            update: {
              cvId: data.cv.id,
              platform: link.platform,
              url: link.url,
              label: link.label,
              order: link.order ?? 0,
            },
            create: {
              id: link.id,
              cvId: data.cv.id,
              platform: link.platform,
              url: link.url,
              label: link.label,
              order: link.order ?? 0,
            },
          });
          count++;
        }
      }

      return count;
    } catch (error) {
      logger.error(`Seed CV échoué: ${error instanceof Error ? error.message : String(error)}`);
      logger.warn("Vérifiez seed/data/cv.json et la connexion DATABASE_URL");
      throw error;
    }
  },

  testimonials: async () => {
    const { force } = parseArgs();
    const data = await loadJSON<Record<string, unknown>>("testimonials");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    let localCreated = 0;

    for (const item of transformed) {
      const testimonialData = item as { id: string } & Record<string, unknown>;
      const existing = await prisma.testimonial.findUnique({ where: { id: testimonialData.id } });

      if (!existing) {
        await prisma.testimonial.create({
          data: testimonialData as Parameters<typeof prisma.testimonial.create>[0]["data"],
        });
        localCreated++;
        createdCount++;
      } else if (force) {
        await prisma.testimonial.update({
          where: { id: testimonialData.id },
          data: testimonialData as Parameters<typeof prisma.testimonial.update>[0]["data"],
        });
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
    return localCreated;
  },
};

// === SEEDING PRINCIPAL ===
async function seed() {
  const { only, force } = parseArgs();

  logger.title("🌱 Seeding de la base de données");

  if (force) {
    logger.warn("Mode --force activé : les données existantes seront mises à jour");
  } else {
    logger.info("Mode additif : seules les nouvelles entités seront créées");
  }

  // Réinitialiser les compteurs
  createdCount = 0;
  updatedCount = 0;
  skippedCount = 0;

  // Déterminer les entités à seeder
  const entitiesToSeed: SeedEntity[] = only ? [only as SeedEntity] : [...SEED_ORDER];

  // Vérifier que l'entité demandée existe
  if (only && !SEED_ORDER.includes(only as SeedEntity)) {
    logger.error(`Entité "${only}" inconnue.`);
    logger.info(`Entités disponibles: ${SEED_ORDER.join(", ")}`);
    process.exit(1);
  }

  try {
    for (const entity of entitiesToSeed) {
      const seeder = seeders[entity];
      if (seeder) {
        logger.step(`Seeding ${entity}...`);
        await seeder();
      }
    }

    // Rapport final
    logger.title("📊 Rapport de seeding");
    if (createdCount > 0) {
      logger.count("créés", createdCount);
    }
    if (updatedCount > 0) {
      logger.count("mis à jour (--force)", updatedCount);
    }
    if (skippedCount > 0) {
      logger.count("ignorés (existants)", skippedCount);
    }

    if (createdCount === 0 && updatedCount === 0) {
      if (skippedCount > 0) {
        logger.info("Toutes les entités existent déjà. Utilisez --force pour les mettre à jour.");
      } else {
        logger.warn("Aucune donnée à seeder. Vérifiez seed/data/*.json");
      }
    } else {
      logger.success("Seeding terminé!");
    }
  } catch (error) {
    logger.error(`Seeding échoué: ${error}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution
seed();
