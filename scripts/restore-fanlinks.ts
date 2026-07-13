import { createPrismaClient } from "../lib/prisma-client";

const prisma = createPrismaClient();

// Restauration des liens fanlink originaux
const fanlinkRestores: Record<string, string> = {
  "The Queens": "https://fanlink.tv/TheQueens",
  "Make Me Feel": "https://fanlink.tv/Voyager1MakeMeFeel",
  "Ambient Guitar": "https://fanlink.tv/ambientguitar",
  "Bass Music": "https://fanlink.tv/Voyager1BassMusic",
  Cyberpunk: "https://fanlink.tv/cyberpunkLoicGhanem",
  "Get Trapped": "https://fanlink.tv/Voyager1GetTrapped",
  "Pop Punk": "https://fanlink.tv/PopPunk",
  Hardcore: "https://fanlink.tv/hardcoreLoicghanem",
  Synthwave: "https://fanlink.tv/loicghanemsynthwave",
  "Fast Metal": "https://fanlink.tv/FastMetal",
  "Kick-ass Metal Jacket": "https://fanlink.tv/Kick-assMetalJacket",
  Metalcore: "https://fanlink.tv/Metalcore",
  "Death Metal": "https://fanlink.tv/Deathmetal",
  "Metalcore II": "https://fanlink.tv/Metalcore2",
  Dystopia: "https://fanlink.tv/LoicGhanemDystopia",
  Terra: "https://fanlink.tv/LoicGhanemTerra",
};

async function main() {
  console.log("🔄 Restauration des liens fanlink...\n");

  let updated = 0;

  for (const [title, fanlink] of Object.entries(fanlinkRestores)) {
    const result = await prisma.album.updateMany({
      where: { title },
      data: { listenLink: fanlink },
    });

    if (result.count > 0) {
      console.log(`✅ ${title} → ${fanlink}`);
      updated++;
    }
  }

  console.log(`\n🎉 Terminé: ${updated} albums restaurés`);
  await prisma.$disconnect();
}

main();
