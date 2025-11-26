"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    colorClass: "text-admin-accent-500 dark:text-admin-accent-400",
    bgClass: "bg-admin-accent-50 dark:bg-admin-accent-900/20 hover:bg-admin-accent-100 dark:hover:bg-admin-accent-900/30",
  },
  {
    label: "Nouvelle vidéo",
    description: "Ajouter une vidéo",
    icon: Plus,
    href: "/admin/videos/new",
    colorClass: "text-neon-magenta dark:text-pink-400",
    bgClass: "bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/30",
  },
  {
    label: "Nouveau service",
    description: "Créer un service",
    icon: Plus,
    href: "/admin/services/new",
    colorClass: "text-neon-cyan dark:text-cyan-400",
    bgClass: "bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/30",
  },
  {
    label: "Paramètres",
    description: "Gérer les paramètres",
    icon: Settings,
    href: "/admin/settings",
    colorClass: "text-admin-text-secondary dark:text-dark-admin-text-secondary",
    bgClass: "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700",
  },
  {
    label: "Voir le site",
    description: "Accéder au site public",
    icon: Eye,
    href: "/",
    colorClass: "text-admin-primary-500 dark:text-admin-primary-400",
    bgClass: "bg-admin-primary-50 dark:bg-admin-primary-900/20 hover:bg-admin-primary-100 dark:hover:bg-admin-primary-900/30",
    external: true,
  },
  {
    label: "Exporter",
    description: "Télécharger les données",
    icon: Download,
    href: "/admin/settings?tab=export",
    colorClass: "text-admin-success-500 dark:text-admin-success-400",
    bgClass: "bg-admin-success-50 dark:bg-admin-success-900/20 hover:bg-admin-success-100 dark:hover:bg-admin-success-900/30",
  },
];

export function QuickActions({ locale }: QuickActionsProps) {
  return (
    <Card className="border border-admin-border dark:border-dark-admin-border bg-white dark:bg-dark-admin-bg-secondary transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                    "group flex flex-col gap-2 rounded-lg p-4 transition-all duration-300 cursor-pointer border border-transparent hover:border-admin-border-dark dark:hover:border-dark-admin-border-light",
                    action.bgClass
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-dark-admin-bg-secondary shadow-sm group-hover:scale-110 transition-all duration-200"
                    )}>
                      <Icon className={cn("h-4 w-4 transition-colors duration-300", action.colorClass)} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-admin-text-primary dark:text-dark-admin-text-primary transition-colors duration-300">
                      {action.label}
                    </p>
                    <p className="text-xs text-admin-text-tertiary dark:text-dark-admin-text-tertiary mt-0.5 transition-colors duration-300">
                      {action.description}
                    </p>
                  </div>
                </div>
              </LinkWrapper>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
