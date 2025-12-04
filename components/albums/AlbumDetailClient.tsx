'use client';

import NeoAlbumDetail from '@/components/neo-brutalist/albums/NeoAlbumDetail';

/* ============================================
   TYPES
   ============================================ */

interface Album {
  id: string;
  title: string;
  img: string;
  poster: string;
  date: string;
  sortedDate: string;
  style: string;
  listenLink: string;
  spotifyEmbed: string | null;
  youtubeEmbed: string | null;
  collabName: string | null;
  collabLink: string | null;
  descriptionsFr: string;
  descriptionsEn: string;
  published: boolean;
}

interface AlbumDetailClientProps {
  album: Album;
  allAlbums: Album[];
  locale: string;
  isPreview?: boolean;
}

/* ============================================
   MAIN COMPONENT
   ============================================ */

export default function AlbumDetailClient({
  album,
  allAlbums,
  locale,
  isPreview = false,
}: AlbumDetailClientProps) {
  return (
    <NeoAlbumDetail
      album={album}
      allAlbums={allAlbums}
      locale={locale}
      isPreview={isPreview}
    />
  );
}
