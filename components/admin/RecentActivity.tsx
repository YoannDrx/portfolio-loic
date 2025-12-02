"use client";

import Link from "next/link";
import Image from "next/image";
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
          color: "text-[var(--admin-neon-lime)]",
          bgColor: "bg-[var(--admin-neon-lime)]/10",
          href: `/admin/albums`,
        };
      case "video":
        return {
          icon: VideoIcon,
          label: "Vidéo",
          color: "text-[var(--admin-neon-magenta)]",
          bgColor: "bg-[var(--admin-neon-magenta)]/10",
          href: `/admin/videos`,
        };
      case "service":
        return {
          icon: Briefcase,
          label: "Service",
          color: "text-[var(--admin-neon-cyan)]",
          bgColor: "bg-[var(--admin-neon-cyan)]/10",
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
    <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h3 className="text-lg font-bold text-white">
          Activité récente
        </h3>
        <Button variant="ghost" size="sm" className="text-[var(--admin-neon-cyan)] hover:text-white hover:bg-white/10" asChild>
          <Link href={`/${locale}/admin/albums`}>
            Voir tout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-white/5 p-4 mb-3">
                <ImageIcon className="h-8 w-8 text-neutral-500" />
              </div>
              <p className="text-sm text-neutral-500">
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
                  className="group flex items-center gap-4 rounded-xl p-3 hover:bg-white/5 transition-colors duration-200"
                >
                  {/* Thumbnail or Icon */}
                  <div className="relative h-12 w-12 flex-shrink-0">
                    {item.img ? (
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="rounded-lg object-cover ring-1 ring-white/10"
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
                      <p className="text-sm font-bold text-white truncate">
                        {item.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Icon className={cn("h-3 w-3", config.color)} />
                      <span>{config.label}</span>
                      <span>•</span>
                      <span>{formatDate(item.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {item.published ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-neon-green/10 text-neon-green border border-neon-green/20">
                      <span className="w-1 h-1 rounded-full bg-neon-green" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 text-neutral-500 border border-white/10">
                      <span className="w-1 h-1 rounded-full bg-neutral-500" />
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
