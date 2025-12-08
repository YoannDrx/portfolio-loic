"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center border-2 border-dashed border-neo-border p-8 text-center bg-neo-surface">
      <div className="mx-auto flex h-16 w-16 items-center justify-center border-2 border-neo-border bg-neo-bg shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
        <Icon className="h-8 w-8 text-neo-text/40" />
      </div>

      <h3 className="mt-6 text-xl font-black uppercase text-neo-text">{title}</h3>

      {description && (
        <p className="mt-2 font-mono text-sm text-neo-text/60 max-w-sm">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            "mt-6 flex items-center gap-2 px-4 py-2",
            "bg-neo-accent text-neo-text-inverse",
            "font-mono text-sm font-bold uppercase",
            "border-2 border-neo-border",
            "shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
            "hover:shadow-[4px_4px_0px_0px_var(--neo-shadow)]",
            "hover:-translate-y-0.5",
            "transition-all duration-200"
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
