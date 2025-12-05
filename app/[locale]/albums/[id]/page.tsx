import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import NeoAlbumDetail from '@/components/neo-brutalist/albums/NeoAlbumDetail';

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateStaticParams() {
  const albums = await prisma.album.findMany({
    where: { published: true },
    select: { id: true },
  });

  const locales = ['fr', 'en'];

  return albums.flatMap((album) =>
    locales.map((locale) => ({
      locale,
      id: album.id,
    }))
  );
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps) {
  const { id, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'albums.detail' });

  try {
    const album = await prisma.album.findUnique({
      where: { id },
      select: {
        title: true,
        style: true,
        date: true,
      },
    });

    if (!album) {
      return {
        title: t('notFound'),
      };
    }

    return {
      title: `${album.title} | Loïc Ghanem`,
      description: `Album ${album.style} (${album.date})`,
    };
  } catch {
    return {
      title: 'Album | Loïc Ghanem',
    };
  }
}

export default async function AlbumDetailPage({ params, searchParams }: PageProps) {
  const { id, locale } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

  // Si mode preview, vérifier l'authentification
  let isAdmin = false;
  if (isPreview) {
    try {
      const headersList = await headers();
      const session = await auth.api.getSession({ headers: headersList });
      isAdmin = session?.user?.role === 'admin';
    } catch {
      isAdmin = false;
    }

    if (!isAdmin) {
      notFound();
    }
  }

  // Fetch the album
  const album = await prisma.album.findUnique({
    where: { id },
  });

  if (!album) {
    notFound();
  }

  // Si pas en mode preview et album non publié, 404
  if (!isPreview && !album.published) {
    notFound();
  }

  // Fetch all albums for related section
  const allAlbums = await prisma.album.findMany({
    where: { published: true },
    orderBy: { sortedDate: 'desc' },
  });

  return (
    <NeoAlbumDetail
      album={album}
      allAlbums={allAlbums}
      locale={locale}
      isPreview={isPreview && isAdmin}
    />
  );
}
