"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Image as ImageIcon, Video as VideoIcon, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentItem {
  id: string;
  title: string;
  type: "album" | "video" | "service";
  published: boolean;
  img?: string;
  updatedAt: string;
}

interface RecentActivityProps {
  items: RecentItem[];
  locale: string;
}

export function RecentActivity({ items, locale }: RecentActivityProps) {
  const getTypeConfig = (type: RecentItem["type"]) => {
    switch (type) {
      case "album":
        return {
          icon: ImageIcon,
          label: "Album",
          color: "text-admin-accent-500",
          bgColor: "bg-admin-accent-50",
          href: `/admin/albums`,
        };
      case "video":
        return {
          icon: VideoIcon,
          label: "Vidéo",
          color: "text-neon-magenta",
          bgColor: "bg-pink-50",
          href: `/admin/videos`,
        };
      case "service":
        return {
          icon: Briefcase,
          label: "Service",
          color: "text-neon-cyan",
          bgColor: "bg-cyan-50",
          href: `/admin/services`,
        };
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days} jours`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  return (
    <Card className="border border-admin-border bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold text-admin-text-primary">
          Activité récente
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-admin-primary-600" asChild>
          <Link href={`/${locale}/admin/albums`}>
            Voir tout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-admin-bg-secondary p-4 mb-3">
                <ImageIcon className="h-8 w-8 text-admin-text-tertiary" />
              </div>
              <p className="text-sm text-admin-text-secondary">
                Aucune activité récente
              </p>
            </div>
          ) : (
            items.map((item) => {
              const config = getTypeConfig(item.type);
              const Icon = config.icon;

              return (
                <div
                  key={item.id}
                  className="group flex items-center gap-4 rounded-lg p-3 hover:bg-admin-bg-secondary transition-colors duration-200"
                >
                  {/* Thumbnail or Icon */}
                  <div className="relative h-12 w-12 flex-shrink-0">
                    {item.img ? (
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="rounded-lg object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div
                        className={cn(
                          "flex h-full w-full items-center justify-center rounded-lg",
                          config.bgColor
                        )}
                      >
                        <Icon className={cn("h-5 w-5", config.color)} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-admin-text-primary truncate">
                        {item.title}
                      </p>
                      <Badge
                        variant={item.published ? "default" : "secondary"}
                        className={cn(
                          "text-xs",
                          item.published
                            ? "bg-admin-success-100 text-admin-success-700 border-admin-success-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        )}
                      >
                        {item.published ? "Publié" : "Brouillon"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-admin-text-tertiary">
                      <Icon className={cn("h-3 w-3", config.color)} />
                      <span>{config.label}</span>
                      <span>•</span>
                      <span>{formatDate(item.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/${locale}${config.href}/${item.id}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
