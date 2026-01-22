import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

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

  // Dynamic pages - Albums
  const albums: AlbumEntry[] = await prisma.album.findMany({
    where: { published: true },
    select: { id: true, updatedAt: true },
  });

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

  // Dynamic pages - Services
  const services: ServiceEntry[] = await prisma.service.findMany({
    where: { published: true },
    select: { id: true, updatedAt: true },
  });

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
