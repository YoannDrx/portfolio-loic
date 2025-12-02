"use client";

import Link from "next/link";
import { Plus, Settings, Download, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  locale: string;
}

const actions = [
  {
    label: "Nouvel album",
    description: "Créer un album photo",
    icon: Plus,
    href: "/admin/albums/new",
    colorClass: "text-[var(--admin-neon-lime)]",
    bgClass: "bg-[var(--admin-neon-lime)]/10 hover:bg-[var(--admin-neon-lime)]/20",
    borderClass: "border-[var(--admin-neon-lime)]/20 hover:border-[var(--admin-neon-lime)]/40",
  },
  {
    label: "Nouvelle vidéo",
    description: "Ajouter une vidéo",
    icon: Plus,
    href: "/admin/videos/new",
    colorClass: "text-[var(--admin-neon-magenta)]",
    bgClass: "bg-[var(--admin-neon-magenta)]/10 hover:bg-[var(--admin-neon-magenta)]/20",
    borderClass: "border-[var(--admin-neon-magenta)]/20 hover:border-[var(--admin-neon-magenta)]/40",
  },
  {
    label: "Nouveau service",
    description: "Créer un service",
    icon: Plus,
    href: "/admin/services/new",
    colorClass: "text-[var(--admin-neon-cyan)]",
    bgClass: "bg-[var(--admin-neon-cyan)]/10 hover:bg-[var(--admin-neon-cyan)]/20",
    borderClass: "border-[var(--admin-neon-cyan)]/20 hover:border-[var(--admin-neon-cyan)]/40",
  },
  {
    label: "Paramètres",
    description: "Gérer les paramètres",
    icon: Settings,
    href: "/admin/settings",
    colorClass: "text-neutral-400",
    bgClass: "bg-white/5 hover:bg-white/10",
    borderClass: "border-white/10 hover:border-white/20",
  },
  {
    label: "Voir le site",
    description: "Accéder au site public",
    icon: Eye,
    href: "/",
    colorClass: "text-[var(--admin-neon-purple)]",
    bgClass: "bg-[var(--admin-neon-purple)]/10 hover:bg-[var(--admin-neon-purple)]/20",
    borderClass: "border-[var(--admin-neon-purple)]/20 hover:border-[var(--admin-neon-purple)]/40",
    external: true,
  },
  {
    label: "Exporter",
    description: "Télécharger les données",
    icon: Download,
    href: "/admin/settings?tab=export",
    colorClass: "text-neon-green",
    bgClass: "bg-neon-green/10 hover:bg-neon-green/20",
    borderClass: "border-neon-green/20 hover:border-neon-green/40",
  },
];

export function QuickActions({ locale }: QuickActionsProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10">
        <h3 className="text-lg font-bold text-white">
          Actions rapides
        </h3>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            const LinkWrapper = action.external ? "a" : Link;
            const linkProps = action.external
              ? { href: `/${locale}${action.href}`, target: "_blank", rel: "noopener noreferrer" }
              : { href: `/${locale}${action.href}` };

            return (
              <LinkWrapper key={action.label} {...linkProps}>
                <div
                  className={cn(
                    "group flex flex-col gap-3 rounded-xl p-4 transition-all duration-300 cursor-pointer border",
                    action.bgClass,
                    action.borderClass
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 group-hover:scale-110 transition-all duration-200"
                    )}>
                      <Icon className={cn("h-4 w-4", action.colorClass)} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {action.label}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {action.description}
                    </p>
                  </div>
                </div>
              </LinkWrapper>
            );
          })}
        </div>
      </div>
    </div>
  );
}
