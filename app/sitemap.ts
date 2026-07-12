import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import albumSeed from "@/seed/data/albums.json";
import serviceSeed from "@/seed/data/services.json";

// Force dynamic rendering to avoid DB calls at build time
export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.loic-ghanem.com";
const locales = ["en", "fr"] as const;

type AlbumEntry = { id: string; slug: string | null; updatedAt: Date };
type ServiceEntry = { id: string; slug: string | null; updatedAt: Date };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = ["", "/about", "/albums", "/services", "/videos", "/contact", "/cv"];

  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page}`,
      changeFrequency: page === "" ? "weekly" : ("monthly" as const),
      priority: page === "" ? 1 : 0.8,
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${page}`])),
          "x-default": `${baseUrl}/fr${page}`,
        },
      },
    }))
  );

  // Dynamic pages - try to fetch from DB, fallback to empty array if unavailable
  let albums: AlbumEntry[] = [];
  let services: ServiceEntry[] = [];

  try {
    albums = await prisma.album.findMany({
      where: { published: true },
      select: { id: true, slug: true, updatedAt: true },
    });

    services = await prisma.service.findMany({
      where: { published: true },
      select: { id: true, slug: true, updatedAt: true },
    });
  } catch {
    albums = albumSeed.map((album) => ({
      id: album.id,
      slug: album.slug,
      updatedAt: new Date(album.updatedAt),
    }));
    services = serviceSeed.map((service) => ({
      id: service.id,
      slug: service.slug,
      updatedAt: new Date(service.updatedAt),
    }));
  }

  const albumEntries: MetadataRoute.Sitemap = albums.flatMap((album: AlbumEntry) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/albums/${album.slug || album.id}`,
      lastModified: album.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/albums/${album.slug || album.id}`])
          ),
          "x-default": `${baseUrl}/fr/albums/${album.slug || album.id}`,
        },
      },
    }))
  );

  const serviceEntries: MetadataRoute.Sitemap = services.flatMap((service: ServiceEntry) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/services/${service.slug || service.id}`,
      lastModified: service.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/services/${service.slug || service.id}`])
          ),
          "x-default": `${baseUrl}/fr/services/${service.slug || service.id}`,
        },
      },
    }))
  );

  return [...staticEntries, ...albumEntries, ...serviceEntries];
}
