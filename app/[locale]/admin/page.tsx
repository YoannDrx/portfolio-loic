import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, Video, Briefcase } from "lucide-react";

export default async function AdminDashboardPage() {
  // Récupérer les statistiques
  const [albumsCount, videosCount, servicesCount] = await Promise.all([
    prisma.album.count(),
    prisma.video.count(),
    prisma.service.count(),
  ]);

  const stats = [
    {
      title: "Albums",
      value: albumsCount,
      icon: Image,
      description: "Albums publiés",
      href: "/admin/albums",
    },
    {
      title: "Vidéos",
      value: videosCount,
      icon: Video,
      description: "Vidéos publiées",
      href: "/admin/videos",
    },
    {
      title: "Services",
      value: servicesCount,
      icon: Briefcase,
      description: "Services proposés",
      href: "/admin/services",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Vue d&apos;ensemble de votre contenu
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Utilisez le menu de navigation pour gérer vos albums, vidéos et
              services. Toutes les modifications sont enregistrées dans la base
              de données et seront immédiatement visibles sur le site public.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/albums"
              className="block text-sm text-primary hover:underline"
            >
              → Gérer les albums
            </a>
            <a
              href="/admin/videos"
              className="block text-sm text-primary hover:underline"
            >
              → Gérer les vidéos
            </a>
            <a
              href="/admin/services"
              className="block text-sm text-primary hover:underline"
            >
              → Gérer les services
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
