import { VideoForm } from "@/components/admin/video-form";

export default async function NewVideoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nouvelle vidéo</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Ajoutez une nouvelle vidéo YouTube
        </p>
      </div>

      <VideoForm locale={locale} />
    </div>
  );
}
