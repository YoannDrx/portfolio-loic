import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar locale={locale} />

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader user={userData} locale={locale} />

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
