"use client";

import { NeoAdminKPICard } from "./neo";
import {
  Image,
  Video,
  Briefcase,
  TrendingUp,
} from "lucide-react";

interface DashboardKPICardsProps {
  stats: {
    albumsCount: number;
    videosCount: number;
    servicesCount: number;
    publishedAlbumsCount: number;
    publishedVideosCount: number;
    publishedServicesCount: number;
    totalContent: number;
    totalPublished: number;
    publishRate: number;
  };
  locale: string;
}

export function DashboardKPICards({ stats, locale }: DashboardKPICardsProps) {
  const kpis = [
    {
      title: "Total Contenu",
      value: stats.totalContent,
      icon: TrendingUp,
      description: `${stats.totalPublished} publiés, ${stats.totalContent - stats.totalPublished} brouillons`,
      href: undefined,
      accentColor: "orange" as const,
      trend: {
        value: stats.publishRate,
        isPositive: stats.publishRate > 50,
      },
    },
    {
      title: "Albums",
      value: stats.albumsCount,
      icon: Image,
      description: `${stats.publishedAlbumsCount} publiés sur ${stats.albumsCount}`,
      href: `/${locale}/admin/albums`,
      accentColor: "lime" as const,
      badge:
        stats.albumsCount - stats.publishedAlbumsCount > 0
          ? `${stats.albumsCount - stats.publishedAlbumsCount} brouillon${stats.albumsCount - stats.publishedAlbumsCount > 1 ? "s" : ""}`
          : undefined,
    },
    {
      title: "Vidéos",
      value: stats.videosCount,
      icon: Video,
      description: `${stats.publishedVideosCount} publiées sur ${stats.videosCount}`,
      href: `/${locale}/admin/videos`,
      accentColor: "magenta" as const,
      badge:
        stats.videosCount - stats.publishedVideosCount > 0
          ? `${stats.videosCount - stats.publishedVideosCount} brouillon${stats.videosCount - stats.publishedVideosCount > 1 ? "s" : ""}`
          : undefined,
    },
    {
      title: "Services",
      value: stats.servicesCount,
      icon: Briefcase,
      description: `${stats.publishedServicesCount} publiés sur ${stats.servicesCount}`,
      href: `/${locale}/admin/services`,
      accentColor: "cyan" as const,
      badge:
        stats.servicesCount - stats.publishedServicesCount > 0
          ? `${stats.servicesCount - stats.publishedServicesCount} brouillon${stats.servicesCount - stats.publishedServicesCount > 1 ? "s" : ""}`
          : undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <NeoAdminKPICard key={kpi.title} {...kpi} />
      ))}
    </div>
  );
}
