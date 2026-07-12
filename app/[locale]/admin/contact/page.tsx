import { prisma } from "@/lib/prisma";
import { ContactMessagesContent } from "@/components/admin/ContactMessagesContent";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Demandes de contact</h1>
        <p className="text-muted-foreground">Messages reçus depuis le formulaire public.</p>
      </div>
      <ContactMessagesContent
        messages={messages.map((message) => ({
          ...message,
          createdAt: message.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
