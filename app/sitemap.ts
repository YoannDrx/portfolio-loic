import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to avoid DB calls at build time
export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://loicghanem.com";
const locales = ["en", "fr"] as const;

type AlbumEntry = { id: string; updatedAt: Date };
type ServiceEntry = { id: string; updatedAt: Date };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = ["", "/about", "/albums", "/services", "/videos", "/contact", "/cv"];

  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap((page) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? "weekly" : ("monthly" as const),
      priority: page === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${page}`])),
      },
    }))
  );

  // Dynamic pages - try to fetch from DB, fallback to empty array if unavailable
  let albums: AlbumEntry[] = [];
  let services: ServiceEntry[] = [];

  try {
    albums = await prisma.album.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    });

    services = await prisma.service.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    });
  } catch {
    // DB not available (CI build) - return only static entries
    return staticEntries;
  }

  const albumEntries: MetadataRoute.Sitemap = albums.flatMap((album: AlbumEntry) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/albums/${album.id}`,
      lastModified: album.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}/albums/${album.id}`])
        ),
      },
    }))
  );

  const serviceEntries: MetadataRoute.Sitemap = services.flatMap((service: ServiceEntry) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/services/${service.id}`,
      lastModified: service.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}/services/${service.id}`])
        ),
      },
    }))
  );

  return [...staticEntries, ...albumEntries, ...serviceEntries];
}
