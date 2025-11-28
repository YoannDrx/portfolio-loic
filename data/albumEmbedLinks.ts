/**
 * Mapping des liens embed pour les players Spotify/YouTube
 * Priorité : Spotify > YouTube
 *
 * Ces liens sont utilisés pour afficher un player embarqué sur la page détail d'album
 * Le listenLink (fanlink) reste utilisé pour le bouton "Écouter cet album"
 */

export interface EmbedLink {
  spotify?: string;
  youtube?: string;
}

export const albumEmbedLinks: Record<string, EmbedLink> = {
  // Albums avec Spotify
  "Ambient Guitar": {
    spotify: "https://open.spotify.com/intl-fr/album/4gVmjCmEDeGyGKf08xuaRz",
  },
  "Hardcore": {
    spotify: "https://open.spotify.com/intl-fr/album/2SVJjtR2St1Qe7pRvzirHg",
  },
  "Fast Metal": {
    spotify: "https://open.spotify.com/intl-fr/album/4dHeAUJfUwtb1KW9BLnh46",
  },
  "Dystopia": {
    spotify: "https://open.spotify.com/intl-fr/album/2UljGjXIIjJztw9qQeqYDN",
  },
  "The Queens": {
    spotify: "https://open.spotify.com/intl-fr/album/0DCSvAbAhyTCKTgNZ3zCxw",
  },
  "Kick-ass Metal Jacket": {
    spotify: "https://open.spotify.com/intl-fr/album/4G2MR7rVamxNIjWVi1pQQ3",
  },
  "Pop Punk": {
    spotify: "https://open.spotify.com/intl-fr/album/7zLSo513JHEKYGF7DCe5vr",
  },
  "Cyberpunk": {
    spotify: "https://open.spotify.com/intl-fr/album/4txNdqxUgZHaRNPIW0Hr2a",
  },
  "Metalcore": {
    spotify: "https://open.spotify.com/intl-fr/album/62QpeUfrSIgmuMq0OqjLBT",
  },
  "Metalcore II": {
    spotify: "https://open.spotify.com/intl-fr/album/5jmP27CdeFXEihU6VRNVDm",
  },
  "Terra": {
    spotify: "https://open.spotify.com/intl-fr/album/0hPOMMDq8xNKFvzdvTnP1S",
  },

  // Albums avec YouTube uniquement (pas sur Spotify)
  "Make Me Feel": {
    youtube: "https://www.youtube.com/watch?v=9zER2h5NwMA&list=OLAK5uy_kzrYJOXO19tJcb2oiKGB8xzec-OE2TqrQ",
  },
  "Get Trapped": {
    youtube: "https://www.youtube.com/watch?v=6gFnlojlD6M&list=OLAK5uy_mP4KlVmT3YBAXTjtF6imxZz8hiHzfoMvU",
  },
  "Death Metal": {
    youtube: "https://www.youtube.com/watch?v=wNjEAdPesZM&list=OLAK5uy_k8ZrEa1c0DOsBXhNchjfzM1GlOWDtjae0",
  },
  "Bass Music": {
    youtube: "https://www.youtube.com/watch?v=PKpepBU7sVE&list=OLAK5uy_n-swzzhLdUBHEQWZcKc8O-cf3GcvYZwtY",
  },

  // Synthwave : pas de lien embed fourni
};

/**
 * Récupère le lien embed pour un album (Spotify prioritaire, YouTube fallback)
 */
export function getEmbedLink(albumTitle: string): string | null {
  const links = albumEmbedLinks[albumTitle];
  if (!links) return null;
  return links.spotify || links.youtube || null;
}

/**
 * Vérifie si un album a un player embarqué disponible
 */
export function hasEmbedPlayer(albumTitle: string): boolean {
  return getEmbedLink(albumTitle) !== null;
}
