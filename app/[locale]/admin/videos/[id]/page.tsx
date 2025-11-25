import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VideoForm } from "@/components/admin/video-form";

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const video = await prisma.video.findUnique({
    where: { id },
  });

  if (!video) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier la vidéo</h1>
        <p className="text-gray-500 dark:text-gray-400">{video.title}</p>
      </div>

      <VideoForm locale={locale} initialData={{
        ...video,
        type: video.type as "OriginalMusic" | "Sync" | "MusicToPicture"
      }} />
    </div>
  );
}
