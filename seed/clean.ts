import { createPrismaClient } from "../lib/prisma-client";
import readline from "readline";
import { logger, CLEAN_ORDER, parseArgs } from "./utils";

const prisma = createPrismaClient();

async function confirmDestructiveAction(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      "\n⚠️  Cette action va SUPPRIMER toutes les données de la base.\n" +
        "   Tapez 'yes' pour confirmer: ",
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "yes");
      }
    );
  });
}

async function clean() {
  const { yes } = parseArgs();

  logger.title("🗑️  Nettoyage de la base de données");

  // Demander confirmation sauf si --yes est passé
  if (!yes) {
    const confirmed = await confirmDestructiveAction();
    if (!confirmed) {
      logger.warn("Opération annulée.");
      process.exit(0);
    }
  }

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
