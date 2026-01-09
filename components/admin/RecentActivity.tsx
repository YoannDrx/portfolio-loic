"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Image as ImageIcon, Video as VideoIcon, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeoAdminCard } from "./neo";

interface RecentItem {
  id: string;
  title: string;
  type: "album" | "video" | "service";
  published: boolean;
  img?: string | null;
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
          color: "text-[#D5FF0A]",
          bgColor: "bg-[#D5FF0A]/10",
          borderColor: "border-[#D5FF0A]/30",
          href: `/admin/albums`,
        };
      case "video":
        return {
          icon: VideoIcon,
          label: "Vidéo",
          color: "text-[#FF006E]",
          bgColor: "bg-[#FF006E]/10",
          borderColor: "border-[#FF006E]/30",
          href: `/admin/videos`,
        };
      case "service":
        return {
          icon: Briefcase,
          label: "Service",
          color: "text-[#00F0FF]",
          bgColor: "bg-[#00F0FF]/10",
          borderColor: "border-[#00F0FF]/30",
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
    <NeoAdminCard size="sm" hover="none" className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-neo-border">
        <h3 className="text-lg font-black text-neo-text uppercase tracking-tight">
          Activité récente
        </h3>
        <Link
          href={`/${locale}/admin/albums`}
          className={cn(
            "flex items-center gap-1 px-3 py-1",
            "font-mono text-xs font-bold uppercase",
            "text-neo-accent hover:bg-neo-accent hover:text-neo-text-inverse",
            "border-2 border-neo-border",
            "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
            "transition-all duration-200"
          )}
        >
          Voir tout
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 flex items-center justify-center border-2 border-neo-border bg-neo-surface mb-4">
              <ImageIcon className="h-8 w-8 text-neo-text/30" />
            </div>
            <p className="font-mono text-sm text-neo-text/60">Aucune activité récente</p>
          </div>
        ) : (
          items.map((item) => {
            const config = getTypeConfig(item.type);
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className="group flex items-center gap-3 p-3 border-2 border-neo-border/50 hover:border-neo-border bg-neo-surface hover:bg-neo-bg transition-all duration-200"
              >
                {/* Thumbnail or Icon */}
                <div className="relative h-12 w-12 flex-shrink-0 border-2 border-neo-border overflow-hidden">
                  {item.img ? (
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      sizes="48px"
                    />
                  ) : (
                    <div
                      className={cn(
                        "flex h-full w-full items-center justify-center",
                        config.bgColor
                      )}
                    >
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-neo-text truncate uppercase">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1 font-mono text-xs text-neo-text/60">
                    <Icon className={cn("h-3 w-3", config.color)} />
                    <span>{config.label}</span>
                    <span>•</span>
                    <span>{formatDate(item.updatedAt)}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={cn(
                    "px-2 py-1 font-mono text-[10px] font-bold uppercase border",
                    item.published
                      ? "bg-green-500/10 text-green-500 border-green-500/30"
                      : "bg-neo-surface text-neo-text/50 border-neo-border"
                  )}
                >
                  {item.published ? "Publié" : "Brouillon"}
                </span>
              </div>
            );
          })
        )}
      </div>
    </NeoAdminCard>
  );
}
