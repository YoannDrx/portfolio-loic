"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Settings, Download, Eye } from "lucide-react";
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
    colorClass: "text-admin-accent-500",
    bgClass: "bg-admin-accent-50 hover:bg-admin-accent-100",
  },
  {
    label: "Nouvelle vidéo",
    description: "Ajouter une vidéo",
    icon: Plus,
    href: "/admin/videos/new",
    colorClass: "text-neon-magenta",
    bgClass: "bg-pink-50 hover:bg-pink-100",
  },
  {
    label: "Nouveau service",
    description: "Créer un service",
    icon: Plus,
    href: "/admin/services/new",
    colorClass: "text-neon-cyan",
    bgClass: "bg-cyan-50 hover:bg-cyan-100",
  },
  {
    label: "Paramètres",
    description: "Gérer les paramètres",
    icon: Settings,
    href: "/admin/settings",
    colorClass: "text-admin-text-secondary",
    bgClass: "bg-gray-50 hover:bg-gray-100",
  },
  {
    label: "Voir le site",
    description: "Accéder au site public",
    icon: Eye,
    href: "/",
    colorClass: "text-admin-primary-500",
    bgClass: "bg-admin-primary-50 hover:bg-admin-primary-100",
    external: true,
  },
  {
    label: "Exporter",
    description: "Télécharger les données",
    icon: Download,
    href: "/admin/settings?tab=export",
    colorClass: "text-admin-success-500",
    bgClass: "bg-admin-success-50 hover:bg-admin-success-100",
  },
];

export function QuickActions({ locale }: QuickActionsProps) {
  return (
    <Card className="border border-admin-border bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-admin-text-primary">
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
                    "group flex flex-col gap-2 rounded-lg p-4 transition-all duration-200 cursor-pointer border border-transparent hover:border-admin-border-dark",
                    action.bgClass
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform duration-200"
                    )}>
                      <Icon className={cn("h-4 w-4", action.colorClass)} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-admin-text-primary">
                      {action.label}
                    </p>
                    <p className="text-xs text-admin-text-tertiary mt-0.5">
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
