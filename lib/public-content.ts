import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import albumSeed from "@/seed/data/albums.json";
import serviceSeed from "@/seed/data/services.json";

type AlbumWithTracks = Prisma.AlbumGetPayload<{ include: { tracks: true } }>;
type PublicService = Prisma.ServiceGetPayload<Record<string, never>>;

const normalizeAlbumKey = (value: string | null | undefined) =>
  value
    ?.toLocaleLowerCase("fr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const findSeedAlbum = (album: { id: string; slug?: string | null; title: string }) => {
  const slug = normalizeAlbumKey(album.slug);
  const title = normalizeAlbumKey(album.title);

  return albumSeed.find(
    (item) =>
      item.id === album.id ||
      (slug && normalizeAlbumKey(item.slug) === slug) ||
      normalizeAlbumKey(item.title) === title
  );
};

const stripLegacyTracklist = (html: string) =>
  html
    .replace(/<p\b[^>]*class=["'][^"']*tracklist-title[^"']*["'][^>]*>[\s\S]*?<\/p>/gi, "")
    .replace(
      /<(?:ul|ol)\b[^>]*class=["'][^"']*tracklist[^"']*["'][^>]*>[\s\S]*?<\/(?:ul|ol)>/gi,
      ""
    );

const normalizeAlbumImage = <
  T extends { id: string; slug?: string | null; title: string; img: string },
>(
  album: T
): T => {
  const seed = findSeedAlbum(album);
  if (!seed || !album.img.startsWith("/img/albums/")) return album;

  const currentName = album.img
    .split("/")
    .pop()
    ?.replace(/\.[^.]+$/, "");
  if (currentName === seed.slug) return album;

  return { ...album, img: seed.img };
};

const normalizeAlbumDetail = <
  T extends {
    id: string;
    slug?: string | null;
    title: string;
    img: string;
    descriptionsFr: string;
    descriptionsEn: string;
  },
>(
  album: T
): T => ({
  ...normalizeAlbumImage(album),
  descriptionsFr: stripLegacyTracklist(album.descriptionsFr),
  descriptionsEn: stripLegacyTracklist(album.descriptionsEn),
});

export async function getServiceByIdentifier(identifier: string): Promise<PublicService | null> {
  try {
    return await prisma.service.findFirst({
      where: { OR: [{ id: identifier }, { slug: identifier }] },
    });
  } catch {
    const seed = serviceSeed.find(
      (service) => service.id === identifier || service.slug === identifier
    );
    if (!seed) return null;
    return {
      ...seed,
      createdAt: new Date(seed.createdAt),
      updatedAt: new Date(seed.updatedAt),
    } as unknown as PublicService;
  }
}

export async function getAlbumByIdentifier(identifier: string): Promise<AlbumWithTracks | null> {
  try {
    const album = await prisma.album.findFirst({
      where: { OR: [{ id: identifier }, { slug: identifier }] },
      include: { tracks: { orderBy: [{ discNumber: "asc" }, { position: "asc" }] } },
    });
    return album ? normalizeAlbumDetail(album) : null;
  } catch {
    const seed = albumSeed.find((album) => album.id === identifier || album.slug === identifier);
    if (!seed) return null;
    const metadata = seed as typeof seed & {
      releaseDate?: string;
      label?: string;
      publisher?: string;
    };
    return {
      ...seed,
      releaseDate: metadata.releaseDate ? new Date(metadata.releaseDate) : null,
      tracklistVerifiedAt: new Date(seed.tracklistVerifiedAt),
      createdAt: new Date(seed.createdAt),
      updatedAt: new Date(seed.updatedAt),
      roleFr: null,
      roleEn: null,
      creditsFr: null,
      creditsEn: null,
      label: metadata.label || null,
      publisher: metadata.publisher || null,
      createdById: seed.createdById,
      tracks: seed.tracks.map((track) => ({
        ...track,
        id: `${seed.id}-${track.discNumber}-${track.position}`,
        albumId: seed.id,
        createdAt: new Date(seed.createdAt),
        updatedAt: new Date(seed.updatedAt),
      })),
    } as unknown as AlbumWithTracks;
  }
}

export const getPublishedAlbums = unstable_cache(
  async () => {
    try {
      const albums = await prisma.album.findMany({
        where: { published: true },
        orderBy: { sortedDate: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          img: true,
          poster: true,
          date: true,
          sortedDate: true,
          style: true,
          listenLink: true,
          collabName: true,
          collabLink: true,
          descriptionsFr: true,
          descriptionsEn: true,
          spotifyEmbed: true,
          featured: true,
          featuredOrder: true,
        },
      });
      return albums.map(normalizeAlbumImage);
    } catch {
      const albums = await prisma.album.findMany({
        where: { published: true },
        orderBy: { sortedDate: "desc" },
        select: {
          id: true,
          title: true,
          img: true,
          poster: true,
          date: true,
          sortedDate: true,
          style: true,
          listenLink: true,
          collabName: true,
          collabLink: true,
          descriptionsFr: true,
          descriptionsEn: true,
          spotifyEmbed: true,
        },
      });
      return albums.map((album) => {
        const seed = albumSeed.find((item) => item.id === album.id);
        return normalizeAlbumImage({
          ...album,
          slug: seed?.slug || null,
          img: seed?.img || album.img,
          featured: seed?.featured ?? false,
          featuredOrder: seed?.featuredOrder ?? null,
        });
      });
    }
  },
  ["published-albums-v3"],
  { tags: ["albums"], revalidate: 3600 }
);

export const getPublishedServices = unstable_cache(
  async () => {
    try {
      return await prisma.service.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      });
    } catch {
      const services = await prisma.$queryRaw<
        Array<{
          id: string;
          no: string;
          title: string;
          text: string;
          largeImg: string;
          largeTitle: string;
          poster: string;
          date: string;
          author: string;
          fullDescription: string;
          descriptionsFr: string;
          descriptionsEn: string;
          published: boolean;
          order: number;
          createdAt: Date;
          updatedAt: Date;
          createdById: string | null;
        }>
      >`SELECT "id", "no", "title", "text", "largeImg", "largeTitle", "poster", "date", "author", "fullDescription", "descriptionsFr", "descriptionsEn", "published", "order", "createdAt", "updatedAt", "createdById" FROM "services" WHERE "published" = true ORDER BY "order" ASC`;
      return services.map((service) => ({
        ...service,
        slug: serviceSeed.find((item) => item.id === service.id)?.slug || null,
      }));
    }
  },
  ["published-services"],
  { tags: ["services"], revalidate: 3600 }
);

export const getPublishedVideos = unstable_cache(
  () =>
    prisma.video.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        img: true,
        type: true,
        videoId: true,
        title: true,
        date: true,
        order: true,
      },
    }),
  ["published-videos"],
  { tags: ["videos"], revalidate: 3600 }
);
