"use client";

import { useTranslations } from "next-intl";
import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type GeneralSettingsValues = {
  siteTitle?: string;
  siteDescription?: string;
  footerBio?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  availability?: string;
};

interface GeneralSettingsProps {
  settings: GeneralSettingsValues;
  onChange: (field: keyof GeneralSettingsValues | string, value: unknown) => void;
}

// Neo-brutalist input component
const NeoInput = ({ id, value, onChange, placeholder, type = "text" }: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={cn(
      "w-full px-4 py-3 bg-neo-surface border-2 border-neo-border",
      "text-neo-text font-mono text-sm placeholder:text-neo-text/40",
      "focus:outline-none focus:border-neo-accent",
      "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
      "transition-all duration-200"
    )}
  />
);

// Neo-brutalist textarea component
const NeoTextarea = ({ id, value, onChange, placeholder, rows = 3 }: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={cn(
      "w-full px-4 py-3 bg-neo-surface border-2 border-neo-border",
      "text-neo-text font-mono text-sm placeholder:text-neo-text/40",
      "focus:outline-none focus:border-neo-accent",
      "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
      "resize-y min-h-[80px]",
      "transition-all duration-200"
    )}
  />
);

// Neo-brutalist label component
const NeoLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
  <label
    htmlFor={htmlFor}
    className="block text-xs font-mono font-bold text-neo-text/70 uppercase tracking-wider mb-2"
  >
    {children}
  </label>
);

export function GeneralSettings({ settings, onChange }: GeneralSettingsProps) {
  const t = useTranslations("admin.settings.general");

  return (
    <div className="space-y-6">
      {/* Site Identity */}
      <div className="border-2 border-neo-border bg-neo-surface p-6 shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neo-border">
          <div className="w-10 h-10 flex items-center justify-center bg-[#00F0FF] border-2 border-neo-border">
            <Globe className="h-5 w-5 text-neo-text" />
          </div>
          <div>
            <h3 className="font-black text-neo-text uppercase tracking-tight">Site</h3>
            <p className="text-xs font-mono text-neo-text/60">Identité du site web</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <NeoLabel htmlFor="siteTitle">{t("siteTitle")}</NeoLabel>
            <NeoInput
              id="siteTitle"
              value={settings.siteTitle || ""}
              onChange={(e) => onChange("siteTitle", e.target.value)}
              placeholder="Loïc Ghanem | Music Composer & Producer"
            />
          </div>

          <div>
            <NeoLabel htmlFor="siteDescription">{t("description")}</NeoLabel>
            <NeoTextarea
              id="siteDescription"
              value={settings.siteDescription || ""}
              onChange={(e) => onChange("siteDescription", e.target.value)}
              placeholder="Award-winning music composer and producer..."
            />
          </div>

          <div>
            <NeoLabel htmlFor="footerBio">{t("footerBio")}</NeoLabel>
            <NeoTextarea
              id="footerBio"
              value={settings.footerBio || ""}
              onChange={(e) => onChange("footerBio", e.target.value)}
              placeholder="Compositeur & Producteur Musical basé à Paris"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-2 border-neo-border bg-neo-surface p-6 shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neo-border">
          <div className="w-10 h-10 flex items-center justify-center bg-[#D5FF0A] border-2 border-neo-border">
            <Mail className="h-5 w-5 text-neo-text" />
          </div>
          <div>
            <h3 className="font-black text-neo-text uppercase tracking-tight">Contact</h3>
            <p className="text-xs font-mono text-neo-text/60">Informations de contact</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <NeoLabel htmlFor="contactEmail">{t("contactEmail")}</NeoLabel>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neo-text/40" />
              <input
                id="contactEmail"
                type="email"
                value={settings.contactEmail || ""}
                onChange={(e) => onChange("contactEmail", e.target.value)}
                placeholder="contact@loicghanem.com"
                className={cn(
                  "w-full pl-10 pr-4 py-3 bg-neo-surface border-2 border-neo-border",
                  "text-neo-text font-mono text-sm placeholder:text-neo-text/40",
                  "focus:outline-none focus:border-neo-accent",
                  "shadow-[2px_2px_0px_0px_var(--neo-shadow)]"
                )}
              />
            </div>
          </div>

          <div>
            <NeoLabel htmlFor="contactPhone">{t("contactPhone")}</NeoLabel>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neo-text/40" />
              <input
                id="contactPhone"
                type="tel"
                value={settings.contactPhone || ""}
                onChange={(e) => onChange("contactPhone", e.target.value)}
                placeholder="+33 X XX XX XX XX"
                className={cn(
                  "w-full pl-10 pr-4 py-3 bg-neo-surface border-2 border-neo-border",
                  "text-neo-text font-mono text-sm placeholder:text-neo-text/40",
                  "focus:outline-none focus:border-neo-accent",
                  "shadow-[2px_2px_0px_0px_var(--neo-shadow)]"
                )}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <NeoLabel htmlFor="location">{t("location")}</NeoLabel>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neo-text/40" />
              <input
                id="location"
                value={settings.location || ""}
                onChange={(e) => onChange("location", e.target.value)}
                placeholder="Paris, France"
                className={cn(
                  "w-full pl-10 pr-4 py-3 bg-neo-surface border-2 border-neo-border",
                  "text-neo-text font-mono text-sm placeholder:text-neo-text/40",
                  "focus:outline-none focus:border-neo-accent",
                  "shadow-[2px_2px_0px_0px_var(--neo-shadow)]"
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
