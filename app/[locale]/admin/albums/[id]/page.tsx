import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AlbumForm } from "@/components/admin/album-form";

export default async function EditAlbumPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const album = await prisma.album.findUnique({
    where: { id },
  });

  if (!album) {
    notFound();
  }

  // Transform null values to undefined for form compatibility
  const formData = {
    ...album,
    collabName: album.collabName ?? undefined,
    collabLink: album.collabLink ?? undefined,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier l&apos;album</h1>
        <p className="text-muted-foreground dark:text-muted-foreground">{album.title}</p>
      </div>

      <AlbumForm locale={locale} initialData={formData} />
    </div>
  );
}
