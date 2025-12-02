import { AlbumForm } from "@/components/admin/album-form";

export default async function NewAlbumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouvel album</h1>
        <p className="text-muted-foreground dark:text-muted-foreground">
          Créez un nouvel album photo
        </p>
      </div>

      <AlbumForm locale={locale} />
    </div>
  );
}
