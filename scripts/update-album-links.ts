import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mapping des nouveaux liens par titre d'album
const linkUpdates: Record<string, string> = {
  "The Queens": "https://open.spotify.com/intl-fr/album/0DCSvAbAhyTCKTgNZ3zCxw",
  "Make Me Feel": "https://www.youtube.com/watch?v=9zER2h5NwMA&list=OLAK5uy_kzrYJOXO19tJcb2oiKGB8xzec-OE2TqrQ",
  "Ambient Guitar": "https://open.spotify.com/intl-fr/album/4gVmjCmEDeGyGKf08xuaRz",
  "Bass Music": "https://www.youtube.com/watch?v=PKpepBU7sVE&list=OLAK5uy_n-swzzhLdUBHEQWZcKc8O-cf3GcvYZwtY",
  "Cyberpunk": "https://open.spotify.com/intl-fr/album/4txNdqxUgZHaRNPIW0Hr2a",
  "Get Trapped": "https://www.youtube.com/watch?v=6gFnlojlD6M&list=OLAK5uy_mP4KlVmT3YBAXTjtF6imxZz8hiHzfoMvU",
  "Pop Punk": "https://open.spotify.com/intl-fr/album/7zLSo513JHEKYGF7DCe5vr",
  "Hardcore": "https://open.spotify.com/intl-fr/album/2SVJjtR2St1Qe7pRvzirHg",
  "Fast Metal": "https://open.spotify.com/intl-fr/album/4dHeAUJfUwtb1KW9BLnh46",
  "Kick-ass Metal Jacket": "https://open.spotify.com/intl-fr/album/4G2MR7rVamxNIjWVi1pQQ3",
  "Metalcore": "https://open.spotify.com/intl-fr/album/62QpeUfrSIgmuMq0OqjLBT",
  "Death Metal": "https://www.youtube.com/watch?v=wNjEAdPesZM&list=OLAK5uy_k8ZrEa1c0DOsBXhNchjfzM1GlOWDtjae0",
  "Metalcore II": "https://open.spotify.com/intl-fr/album/5jmP27CdeFXEihU6VRNVDm",
  "Dystopia": "https://open.spotify.com/intl-fr/album/2UljGjXIIjJztw9qQeqYDN",
  "Terra": "https://open.spotify.com/intl-fr/album/0hPOMMDq8xNKFvzdvTnP1S",
  // Synthwave reste inchangé (pas de nouveau lien fourni)
};

async function main() {
  console.log("🔄 Mise à jour des liens albums...\n");

  let updated = 0;
  let notFound = 0;

  for (const [title, newLink] of Object.entries(linkUpdates)) {
    try {
      const result = await prisma.album.updateMany({
        where: { title },
        data: { listenLink: newLink },
      });

      if (result.count > 0) {
        console.log(`✅ ${title} → ${newLink.substring(0, 50)}...`);
        updated++;
      } else {
        console.log(`⚠️  ${title} non trouvé dans la base`);
        notFound++;
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${title}:`, error);
    }
  }

  console.log(`\n🎉 Terminé: ${updated} albums mis à jour, ${notFound} non trouvés`);
  await prisma.$disconnect();
}

main();
