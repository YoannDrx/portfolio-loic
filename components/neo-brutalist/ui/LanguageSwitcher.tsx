"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "minimal";
}

export const LanguageSwitcher = ({ className, variant = "default" }: LanguageSwitcherProps) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const switchLocale = (newLocale: "fr" | "en") => {
    // For dynamic routes, we need to pass params
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace({ pathname: pathname as any, params: params as any }, { locale: newLocale });
  };

  if (variant === "minimal") {
    return (
      <button
        onClick={() => switchLocale(locale === "fr" ? "en" : "fr")}
        className={cn(
          "font-mono text-xs font-bold border-2 border-neo-border px-3 py-1.5",
          "bg-neo-surface text-neo-text",
          "hover:bg-neo-accent hover:text-neo-text-inverse",
          "transition-colors duration-150",
          className
        )}
      >
        {locale === "fr" ? "EN" : "FR"}
      </button>
    );
  }

  return (
    <div className={cn("flex border-2 border-neo-border h-9", className)}>
      <button
        onClick={() => switchLocale("fr")}
        className={cn(
          "px-2.5 font-mono text-xs font-bold transition-colors duration-150",
          locale === "fr"
            ? "bg-neo-accent text-neo-text-inverse"
            : "bg-neo-surface text-neo-text hover:bg-neo-surface-hover"
        )}
      >
        FR
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={cn(
          "px-2.5 font-mono text-xs font-bold transition-colors duration-150 border-l-2 border-neo-border",
          locale === "en"
            ? "bg-neo-accent text-neo-text-inverse"
            : "bg-neo-surface text-neo-text hover:bg-neo-surface-hover"
        )}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
