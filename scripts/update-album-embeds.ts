import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapping des albums avec leurs liens Spotify et YouTube
const albumUpdates: Record<string, { spotifyEmbed: string | null; youtubeEmbed: string | null }> = {
  // Terra
  "Terra": {
    spotifyEmbed: "https://open.spotify.com/intl-fr/album/0hPOMMDq8xNKFvzdvTnP1S",
    youtubeEmbed: "https://www.youtube.com/watch?v=V3FOmN5KIHE&list=OLAK5uy_nfPLFESSFDlohd6yqy6ONZNKLdVM3f8Gg"
  },
  // Dystopia
  "Dystopia": {
    spotifyEmbed: "https://open.spotify.com/intl-fr/album/2UljGjXIIjJztw9qQeqYDN",
    youtubeEmbed: "https://www.youtube.com/watch?v=ixWfgRvX5J4&list=OLAK5uy_mF-fwAYz8hpxEgY_VTIaxHOIyyHogQhTk"
  },
  // Metalcore II
  "Metalcore II": {
    spotifyEmbed: "https://open.spotify.com/intl-fr/album/5jmP27CdeFXEihU6VRNVDm",
    youtubeEmbed: "https://www.youtube.com/watch?v=zyOHDFw3zxU&list=OLAK5uy_mExhpCSUgl67gcCKugFuXqh023UXypctw"
  },
  // The Queens
  "The Queens": {
    spotifyEmbed: "https://open.spotify.com/intl-fr/album/0DCSvAbAhyTCKTgNZ3zCxw",
    youtubeEmbed: "https://www.youtube.com/watch?v=L9pJGVMe03o&list=OLAK5uy_l7VHchdfnphID3o0-TpLyeBgzuBkPbqsU"
  },
  // Make Me Feel (Tidal only - no Spotify/YouTube)
  "Make Me Feel": {
    spotifyEmbed: null,
    youtubeEmbed: null
  },
  // Bass Music (Tidal only - no Spotify/YouTube)
  "Bass Music": {
    spotifyEmbed: null,
    youtubeEmbed: null
  },
  // Get Trapped (Tidal only - no Spotify/YouTube)
  "Get Trapped": {
    spotifyEmbed: null,
    youtubeEmbed: null
  },
  // Pop Punk
  "Pop Punk": {
    spotifyEmbed: "https://open.spotify.com/intl-fr/album/7zLSo513JHEKYGF7DCe5vr",
    youtubeEmbed: "https://www.youtube.com/watch?v=r460dmdFafk&list=OLAK5uy_n5SOBMgQb4k9GreoeJWlytZ61n8hA8kbA"
  },
  // Ambient Guitar
  "Ambient Guitar": {
    spotifyEmbed: "https://open.spotify.com/intl-fr/album/4gVmjCmEDeGyGKf08xuaRz",
    youtubeEmbed: "https://www.youtube.com/watch?v=CP-gAFVfP_8&list=PLKZaQC_teLIy-UM5jtaX07WfOHJ310Yc8"
  },
  // Hardcore
  "Hardcore": {
    spotifyEmbed: "https://open.spotify.com/intl-fr/album/2SVJjtR2St1Qe7pRvzirHg",
    youtubeEmbed: "https://www.youtube.com/watch?v=m3-3c8zbV7g&list=OLAK5uy_kAxYSDY_UdYLC2UPZX8YZXzxVW6eGSg6E"
  },
  // Fast Metal
  "Fast Metal": {
    spotifyEmbed: "https://open.spotify.com/intl-fr/album/4dHeAUJfUwtb1KW9BLnh46",
    youtubeEmbed: "https://www.youtube.com/watch?v=shjY8Z5xFmI&list=PLKZaQC_teLIxjo3YvUW7RjuS9WAJMODBV"
  },
  // Kick-ass Metal Jacket
  "Kick-ass Metal Jacket": {
    spotifyEmbed: "https://open.spotify.com/intl-fr/album/4G2MR7rVamxNIjWVi1pQQ3",
    youtubeEmbed: "https://www.youtube.com/watch?v=XPbR4ktBzSQ&list=OLAK5uy_mjs5D8RqPpt_s6ZFBrP5G94lsVOFJrki4"
  },
  // Cyberpunk
  "Cyberpunk": {
    spotifyEmbed: "https://open.spotify.com/intl-fr/album/4txNdqxUgZHaRNPIW0Hr2a",
    youtubeEmbed: "https://www.youtube.com/watch?v=iwz8AugJmuo&list=OLAK5uy_kxAMfTD4IGp39x0RGPtrTw4QJCJ_oMFIM"
  },
  // Synthwave (fanlink only - no Spotify/YouTube)
  "Synthwave": {
    spotifyEmbed: null,
    youtubeEmbed: null
  },
  // Metalcore
  "Metalcore": {
    spotifyEmbed: "https://open.spotify.com/intl-fr/album/62QpeUfrSIgmuMq0OqjLBT",
    youtubeEmbed: "https://www.youtube.com/watch?v=CpDRXIkiW4Q&list=OLAK5uy_l7_oB_5qydvDouSTjIDcRq1h9U0NdW6WY"
  },
  // Death Metal (Tidal only - no Spotify/YouTube)
  "Death Metal": {
    spotifyEmbed: null,
    youtubeEmbed: null
  }
};

async function updateAlbumEmbeds() {
  console.log('🎵 Mise à jour des liens Spotify/YouTube pour les albums...\n');

  for (const [title, embeds] of Object.entries(albumUpdates)) {
    try {
      const result = await prisma.album.updateMany({
        where: { title },
        data: {
          spotifyEmbed: embeds.spotifyEmbed,
          youtubeEmbed: embeds.youtubeEmbed,
          updatedAt: new Date()
        }
      });

      if (result.count > 0) {
        const status = embeds.spotifyEmbed
          ? `✅ Spotify + ${embeds.youtubeEmbed ? 'YouTube' : 'pas de YouTube'}`
          : embeds.youtubeEmbed
            ? '✅ YouTube uniquement'
            : '⚪ Fanlink uniquement';
        console.log(`${status}: ${title}`);
      } else {
        console.log(`⚠️  Album non trouvé: ${title}`);
      }
    } catch (error) {
      console.error(`❌ Erreur pour ${title}:`, error);
    }
  }

  console.log('\n✨ Mise à jour terminée!');
}

updateAlbumEmbeds()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
