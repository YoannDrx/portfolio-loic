import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Vérifier l'authentification côté serveur
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Rediriger si pas authentifié ou pas admin
  if (!session?.user || session.user.role !== "admin") {
    redirect(`/${locale}/login`);
  }

  // Transform null values to undefined for component compatibility
  const userData = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name ?? undefined,
    role: session.user.role ?? undefined,
  };

  return (
    <AdminLayoutClient locale={locale} user={userData}>
      {children}
    </AdminLayoutClient>
  );
}
