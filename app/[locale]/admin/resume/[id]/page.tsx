import { prisma } from "@/lib/prisma";
import { ResumeForm } from "@/components/admin/resume-form";
import { notFound } from "next/navigation";

export default async function EditResumeEntryPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;

  const entry = await prisma.resumeEntry.findUnique({
    where: { id },
  });

  if (!entry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-admin-text-primary">Edit Resume Entry</h1>
      <ResumeForm locale={locale} initialData={entry} isEditing />
    </div>
  );
}
