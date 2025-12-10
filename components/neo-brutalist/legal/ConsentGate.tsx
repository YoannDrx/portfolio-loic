"use client";

import React from "react";
import { Shield, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useConsent, type ConsentCategory } from "./ConsentProvider";
import { cn } from "@/lib/utils";

interface ConsentGateProps {
  category: ConsentCategory;
  title?: string;
  description?: string;
  ctaLabel?: string;
  manageLabel?: string;
  className?: string;
  icon?: React.ReactNode;
  compact?: boolean;
  onAccept?: () => void;
  variant?: "boxed" | "plain";
  minHeight?: number;
  children: React.ReactNode;
}

export const ConsentGate: React.FC<ConsentGateProps> = ({
  category,
  title,
  description,
  ctaLabel,
  manageLabel,
  className,
  icon,
  compact = false,
  onAccept,
  variant = "boxed",
  minHeight,
  children,
}) => {
  const t = useTranslations("consent");
  const { state, isReady, setCategory, openManager } = useConsent();

  if (isReady && state[category]) {
    return <>{children}</>;
  }

  return (
    <div
      className={cn(
        "relative flex flex-col text-neo-text",
        variant === "boxed" &&
          "border-2 border-neo-border bg-neo-surface shadow-[6px_6px_0px_0px_var(--neo-border)]",
        variant === "plain" && "bg-neo-bg",
        className
      )}
      style={minHeight ? { minHeight } : undefined}
    >
      <div className={cn("flex w-full flex-col h-full p-4 md:p-6", compact && "p-4")}>
        <div className="flex flex-col items-center text-center gap-5 md:gap-6 flex-1 justify-center">
          <div className="flex h-12 w-12 items-center justify-center bg-neo-text text-neo-text-inverse border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-accent)] flex-shrink-0">
            {icon || <Shield className="w-6 h-6" />}
          </div>
          <div className="space-y-3 md:space-y-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-neo-accent text-center">
              {t("gate.badge")}
            </div>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">
              {title || t("gate.mediaTitle")}
            </h3>
            <p className="text-sm md:text-base text-neo-text/80 max-w-2xl">
              {description || t("gate.mediaDescription")}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-3 md:gap-4 justify-center pt-4">
          <button
            onClick={() => {
              setCategory(category, true);
              onAccept?.();
            }}
            className="px-4 py-2 bg-neo-accent text-neo-text font-mono text-xs uppercase font-bold border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-border)] hover:-translate-y-0.5 transition-transform"
          >
            {ctaLabel || t("gate.mediaCta")}
          </button>
          <button
            onClick={openManager}
            className="px-4 py-2 bg-neo-surface text-neo-text font-mono text-xs uppercase font-bold border-2 border-neo-border shadow-[4px_4px_0px_0px_var(--neo-border)] hover:-translate-y-0.5 transition-transform inline-flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {manageLabel || t("gate.manage")}
          </button>
        </div>
      </div>
    </div>
  );
};
