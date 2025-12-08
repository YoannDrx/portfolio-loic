"use client";

import Link from "next/link";
import { Plus, Settings, Download, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeoAdminCard } from "./neo";

interface QuickActionsProps {
  locale: string;
}

const actions = [
  {
    label: "Nouvel album",
    description: "Créer un album photo",
    icon: Plus,
    href: "/admin/albums/new",
    color: "#D5FF0A",
  },
  {
    label: "Nouvelle vidéo",
    description: "Ajouter une vidéo",
    icon: Plus,
    href: "/admin/videos/new",
    color: "#FF006E",
  },
  {
    label: "Nouveau service",
    description: "Créer un service",
    icon: Plus,
    href: "/admin/services/new",
    color: "#00F0FF",
  },
  {
    label: "Paramètres",
    description: "Gérer les paramètres",
    icon: Settings,
    href: "/admin/settings",
    color: "#64748B",
  },
  {
    label: "Voir le site",
    description: "Accéder au site public",
    icon: Eye,
    href: "/",
    color: "#8B5CF6",
    external: true,
  },
  {
    label: "Exporter",
    description: "Télécharger les données",
    icon: Download,
    href: "/admin/settings?tab=export",
    color: "#22C55E",
  },
];

export function QuickActions({ locale }: QuickActionsProps) {
  return (
    <NeoAdminCard size="sm" hover="none" className="w-full">
      {/* Header */}
      <div className="pb-4 mb-4 border-b-2 border-neo-border">
        <h3 className="text-lg font-black text-neo-text uppercase tracking-tight">
          Actions rapides
        </h3>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const fullHref = `/${locale}${action.href}`;

          const content = (
            <div
              className={cn(
                "group flex items-center gap-3 p-3",
                "border-2 border-neo-border bg-neo-surface",
                "hover:bg-neo-bg hover:-translate-y-0.5",
                "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
                "hover:shadow-[4px_4px_0px_0px_var(--neo-shadow)]",
                "transition-all duration-200 cursor-pointer"
              )}
            >
              {/* Icon */}
              <div
                className="flex h-10 w-10 items-center justify-center border-2 border-neo-border group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${action.color}20` }}
              >
                <Icon className="h-5 w-5" style={{ color: action.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-neo-text uppercase truncate">
                  {action.label}
                </p>
                <p className="font-mono text-xs text-neo-text/60 truncate">
                  {action.description}
                </p>
              </div>
            </div>
          );

          return action.external ? (
            <a key={action.label} href={fullHref} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          ) : (
            <Link key={action.label} href={fullHref}>
              {content}
            </Link>
          );
        })}
      </div>
    </NeoAdminCard>
  );
}
