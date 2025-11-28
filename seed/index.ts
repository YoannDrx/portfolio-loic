import { PrismaClient } from "@prisma/client";
import {
  logger,
  loadJSON,
  transformDates,
  parseArgs,
  SEED_ORDER,
  SeedEntity,
} from "./utils";

const prisma = new PrismaClient();

// === SEEDERS PAR ENTITÉ ===
const seeders: Record<SeedEntity, () => Promise<number>> = {
  users: async () => {
    const data = await loadJSON("users");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    await prisma.user.createMany({ data: transformed, skipDuplicates: true });
    return data.length;
  },

  accounts: async () => {
    const data = await loadJSON("accounts");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    await prisma.account.createMany({ data: transformed, skipDuplicates: true });
    return data.length;
  },

  site_settings: async () => {
    const data = await loadJSON("site_settings");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    for (const item of transformed) {
      await prisma.siteSettings.upsert({
        where: { id: (item as { id: string }).id },
        update: item,
        create: item,
      });
    }
    return data.length;
  },

  navigation_items: async () => {
    const data = await loadJSON("navigation_items");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    await prisma.navigationItem.createMany({
      data: transformed,
      skipDuplicates: true,
    });
    return data.length;
  },

  albums: async () => {
    const data = await loadJSON("albums");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    for (const item of transformed) {
      await prisma.album.upsert({
        where: { id: (item as { id: string }).id },
        update: item,
        create: item,
      });
    }
    return data.length;
  },

  videos: async () => {
    const data = await loadJSON("videos");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    for (const item of transformed) {
      await prisma.video.upsert({
        where: { id: (item as { id: string }).id },
        update: item,
        create: item,
      });
    }
    return data.length;
  },

  services: async () => {
    const data = await loadJSON("services");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    for (const item of transformed) {
      await prisma.service.upsert({
        where: { id: (item as { id: string }).id },
        update: item,
        create: item,
      });
    }
    return data.length;
  },

  resume_entries: async () => {
    const data = await loadJSON("resume_entries");
    if (data.length === 0) return 0;
    const transformed = transformDates(data);
    for (const item of transformed) {
      await prisma.resumeEntry.upsert({
        where: { id: (item as { id: string }).id },
        update: item,
        create: item,
      });
    }
    return data.length;
  },
};

// === SEEDING PRINCIPAL ===
async function seed() {
  const { only } = parseArgs();

  logger.title("🌱 Seeding de la base de données");

  // Déterminer les entités à seeder
  const entitiesToSeed: SeedEntity[] = only
    ? [only as SeedEntity]
    : [...SEED_ORDER];

  // Vérifier que l'entité demandée existe
  if (only && !SEED_ORDER.includes(only as SeedEntity)) {
    logger.error(`Entité "${only}" inconnue.`);
    logger.info(`Entités disponibles: ${SEED_ORDER.join(", ")}`);
    process.exit(1);
  }

  try {
    let totalSeeded = 0;

    for (const entity of entitiesToSeed) {
      const seeder = seeders[entity];
      if (seeder) {
        logger.step(`Seeding ${entity}...`);
        const count = await seeder();
        if (count > 0) {
          logger.count(entity, count);
          totalSeeded += count;
        }
      }
    }

    if (totalSeeded === 0) {
      logger.warn("Aucune donnée à seeder. Vérifiez seed/data/*.json");
    } else {
      logger.success(`Seeding terminé! ${totalSeeded} enregistrements créés.`);
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
