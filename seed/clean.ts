import { PrismaClient } from "@prisma/client";
import { logger, CLEAN_ORDER } from "./utils";

const prisma = new PrismaClient();

async function clean() {
  logger.title("🗑️  Nettoyage de la base de données");

  try {
    // Suppression dans l'ordre inverse des dépendances FK
    for (const modelName of CLEAN_ORDER) {
      try {
        const model = (prisma as unknown as Record<string, unknown>)[modelName];
        if (model && typeof model === "object" && "deleteMany" in model) {
          const deleteMany = (model as { deleteMany: () => Promise<{ count: number }> }).deleteMany;
          const result = await deleteMany();
          if (result.count > 0) {
            logger.count(modelName, result.count);
          }
        }
      } catch {
        // Model peut ne pas exister ou être vide, on continue
      }
    }

    logger.success("Base de données nettoyée");
  } catch (error) {
    logger.error(`Nettoyage échoué: ${error}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution directe
clean();
