"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ShieldCheck, SlidersHorizontal, X, CheckCircle2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useConsent } from "./ConsentProvider";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle?: () => void;
  locked?: boolean;
}

const CategoryCard = ({ title, description, enabled, onToggle, locked }: CategoryCardProps) => (
  <div
    className={cn(
      "border-2 border-neo-border bg-neo-surface p-4 shadow-[4px_4px_0px_0px_var(--neo-border)]"
    )}
  >
    <div className="flex items-center justify-between gap-2 mb-2">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-neo-accent" />
        <h4 className="text-sm font-black uppercase tracking-tight">{title}</h4>
      </div>
      <button
        disabled={locked}
        onClick={onToggle}
        className={cn(
          "px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] border-2 border-neo-border",
          enabled
            ? "bg-neo-accent text-neo-text shadow-[3px_3px_0px_0px_var(--neo-border)]"
            : "bg-neo-surface text-neo-text/70",
          locked && "opacity-60 cursor-not-allowed"
        )}
      >
        {locked ? "On" : enabled ? "On" : "Off"}
      </button>
    </div>
    <p className="text-sm text-neo-text/80 leading-relaxed">{description}</p>
  </div>
);

export const NeoCookieConsent = () => {
  const t = useTranslations("consent");
  const locale = useLocale();
  const {
    state,
    isReady,
    hasChoice,
    isManagerOpen,
    closeManager,
    acceptAll,
    rejectAll,
    setCategory,
  } = useConsent();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isManagerOpen) {
      setShowDetails(false);
    }
  }, [isManagerOpen]);

  const categories = useMemo(
    () => [
      {
        key: "essential",
        title: t("categories.essential.title"),
        description: t("categories.essential.description"),
        enabled: true,
        locked: true,
      },
      {
        key: "media",
        title: t("categories.media.title"),
        description: t("categories.media.description"),
        enabled: state.media,
      },
      {
        key: "analytics",
        title: t("categories.analytics.title"),
        description: t("categories.analytics.description"),
        enabled: state.analytics,
      },
    ],
    [state.media, state.analytics, t]
  );

  if (!isReady || !isManagerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neo-bg/80 backdrop-blur-md">
      <div className="w-full sm:max-w-4xl px-4">
        <div className="relative border-4 border-neo-border bg-neo-text text-neo-text-inverse shadow-[12px_12px_0px_0px_var(--neo-accent)]">
          <button
            onClick={() => {
              // Fermer sans enregistrer de choix pour reproposer plus tard
              setShowDetails(false);
              closeManager();
            }}
            aria-label={t("actions.close")}
            className="absolute -top-4 -right-4 p-3 border-2 border-neo-border bg-neo-text text-neo-text-inverse shadow-[6px_6px_0px_0px_var(--neo-accent)] hover:bg-neo-accent hover:text-neo-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6 p-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-neo-accent text-neo-text px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_var(--neo-border)]">
                <ShieldCheck className="w-4 h-4" />
                {t("badge")}
              </div>
              <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                {t("title")}
              </h3>
              <p className="text-sm md:text-base text-neo-text-inverse/80 leading-relaxed">
                {t("description")}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={acceptAll}
                  className="px-4 py-2 bg-neo-accent text-neo-text font-mono text-xs uppercase font-bold border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-border)] hover:-translate-y-0.5 transition-transform"
                >
                  {t("actions.acceptAll")}
                </button>
                <button
                  onClick={rejectAll}
                  className="px-4 py-2 bg-neo-text-inverse text-neo-text font-mono text-xs uppercase font-bold border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-border)] hover:-translate-y-0.5 transition-transform"
                >
                  {t("actions.rejectAll")}
                </button>
                <button
                  onClick={() => setShowDetails((prev) => !prev)}
                  className="px-4 py-2 bg-neo-text text-neo-text-inverse font-mono text-xs uppercase font-bold border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-accent)] hover:-translate-y-0.5 transition-transform inline-flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  {showDetails ? t("actions.close") : t("actions.customize")}
                </button>
              </div>
              <div className="flex items-center gap-2 text-[11px] uppercase font-mono tracking-[0.14em] text-neo-text-inverse/70">
                <CheckCircle2 className="w-4 h-4" />
                {t("lastUpdatedLabel", { date: t("lastUpdated") })}
                <span className="opacity-50">|</span>
                <span>{locale.toUpperCase()}</span>
              </div>
            </div>

            {showDetails && (
              <div className="space-y-3 bg-neo-surface text-neo-text border-2 border-neo-border p-4 shadow-[6px_6px_0px_0px_var(--neo-border)]">
                <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-neo-accent">
                  {t("categoriesTitle")}
                </h4>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <CategoryCard
                      key={cat.key}
                      title={cat.title}
                      description={cat.description}
                      enabled={cat.enabled}
                      locked={cat.locked}
                      onToggle={
                        cat.locked
                          ? undefined
                          : () => setCategory(cat.key as "media" | "analytics", !cat.enabled)
                      }
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      closeManager();
                      setShowDetails(false);
                    }}
                    className="px-4 py-2 bg-neo-accent text-neo-text font-mono text-xs uppercase font-bold border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-border)] hover:-translate-y-0.5 transition-transform"
                  >
                    {t("actions.save")}
                  </button>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="px-4 py-2 bg-neo-surface text-neo-text font-mono text-xs uppercase font-bold border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-border)] hover:-translate-y-0.5 transition-transform"
                  >
                    {t("actions.close")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
