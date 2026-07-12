"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string | null;
  projectType: string;
  projectFormat: string | null;
  deadline: string | null;
  budget: string | null;
  references: string | null;
  subject: string | null;
  message: string;
  status: string;
  emailStatus: string;
  createdAt: string;
}

export function ContactMessagesContent({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const setStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/contact-messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  };
  const remove = async (id: string) => {
    if (!window.confirm("Supprimer définitivement ce message ?")) return;
    await fetch(`/api/admin/contact-messages/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 && <p className="text-muted-foreground">Aucune demande reçue.</p>}
      {messages.map((message) => (
        <Card key={message.id}>
          <CardHeader>
            <CardTitle className="flex flex-wrap justify-between gap-3">
              <span>
                {message.name} — {message.projectType}
              </span>
              <span className="text-sm font-normal">
                {new Date(message.createdAt).toLocaleString("fr-FR")}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              <a className="underline" href={`mailto:${message.email}`}>
                {message.email}
              </a>
              {message.company ? ` · ${message.company}` : ""}
            </p>
            <p className="whitespace-pre-wrap">{message.message}</p>
            <div className="text-sm text-muted-foreground">
              Format : {message.projectFormat || "—"} · Échéance : {message.deadline || "—"} ·
              Budget : {message.budget || "—"} · Email : {message.emailStatus}
            </div>
            {message.references && <p className="text-sm">Références : {message.references}</p>}
            <div className="flex flex-wrap gap-2">
              {["new", "in_progress", "replied", "archived"].map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={message.status === status ? "default" : "outline"}
                  onClick={() => setStatus(message.id, status)}
                >
                  {status}
                </Button>
              ))}
              <Button size="sm" variant="destructive" onClick={() => remove(message.id)}>
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
