import { createPrismaClient } from "../lib/prisma-client";

const prisma = createPrismaClient();

async function main() {
  console.log("🔄 Mise à jour des services selon les retours de Loic...\n");

  // 1. Mettre à jour l'image des services 1 & 2 (Composition & Production)
  console.log("1. Mise à jour des images Composition & Production...");
  const compositionUpdate = await prisma.service.updateMany({
    where: {
      title: { contains: "Composition", mode: "insensitive" },
    },
    data: {
      poster: "/img/slider/loic-studio-front.jpg",
      largeImg: "/img/slider/loic-studio-front.jpg",
    },
  });
  console.log(`   - Composition: ${compositionUpdate.count} service(s) mis à jour`);

  const productionUpdate = await prisma.service.updateMany({
    where: {
      title: { contains: "Production", mode: "insensitive" },
    },
    data: {
      poster: "/img/slider/loic-studio-front.jpg",
      largeImg: "/img/slider/loic-studio-front.jpg",
    },
  });
  console.log(`   - Production: ${productionUpdate.count} service(s) mis à jour`);

  // 2. Renommer le service 4 (Vocal Producer)
  console.log("\n2. Renommage du service Vocal...");
  const vocalUpdate = await prisma.service.updateMany({
    where: {
      OR: [
        { title: { contains: "vocal", mode: "insensitive" } },
        { title: { contains: "Enregistrement", mode: "insensitive" } },
      ],
    },
    data: {
      title: "Edition, correction et édition vocal",
      largeTitle: "Edition, correction et édition vocal",
    },
  });
  console.log(`   - Vocal: ${vocalUpdate.count} service(s) renommé(s)`);

  // 3. Mettre à jour le service 5 (Mastering) - images + supprimer surround
  console.log("\n3. Mise à jour du service Mastering...");
  const mastering = await prisma.service.findFirst({
    where: { title: { contains: "Mastering", mode: "insensitive" } },
  });

  if (mastering) {
    // Supprimer "surround" des descriptions (insensible à la casse)
    const newDescFr = mastering.descriptionsFr
      .replace(/surround/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    const newDescEn = mastering.descriptionsEn
      .replace(/surround/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    await prisma.service.update({
      where: { id: mastering.id },
      data: {
        poster: "/img/services/mastering-eq.jpg",
        largeImg: "/img/services/mastering-detail-eq.jpg",
        descriptionsFr: newDescFr,
        descriptionsEn: newDescEn,
      },
    });
    console.log(`   - Mastering mis à jour (id: ${mastering.id})`);
    console.log(`   - Nouvelles images: mastering-eq.jpg, mastering-detail-eq.jpg`);
    console.log(`   - "surround" supprimé des descriptions`);
  } else {
    console.log("   ⚠️ Service Mastering non trouvé!");
  }

  console.log("\n✅ Mise à jour terminée!");
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
