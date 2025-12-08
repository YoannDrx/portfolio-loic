"use client";

import { Home, LayoutGrid, ArrowUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type ContentSettingsValues = {
  homepageFeaturedAlbumsCount?: number;
  homepageLatestVideosCount?: number;
  albumsPerPage?: number;
  videosPerPage?: number;
  servicesPerPage?: number;
  defaultAlbumSort?: string;
  defaultVideoSort?: string;
  defaultServiceSort?: string;
};

interface ContentSettingsProps {
  settings: ContentSettingsValues;
  onChange: (field: keyof ContentSettingsValues | string, value: unknown) => void;
}

// Neo-brutalist input component
const NeoInput = ({
  id,
  value,
  onChange,
  type = "text",
  min,
  max,
}: {
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  min?: number;
  max?: number;
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    min={min}
    max={max}
    className={cn(
      "w-full px-4 py-3 bg-neo-surface border-2 border-neo-border",
      "text-neo-text font-mono text-sm placeholder:text-neo-text/40",
      "focus:outline-none focus:border-neo-accent",
      "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
      "transition-all duration-200"
    )}
  />
);

// Neo-brutalist select component
const NeoSelect = ({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => (
  <select
    id={id}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      "w-full px-4 py-3 bg-neo-surface border-2 border-neo-border",
      "text-neo-text font-mono text-sm",
      "focus:outline-none focus:border-neo-accent",
      "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
      "cursor-pointer appearance-none",
      "transition-all duration-200"
    )}
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
      backgroundPosition: "right 0.75rem center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "1.5em 1.5em",
      paddingRight: "2.5rem",
    }}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
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

export function ContentSettings({ settings, onChange }: ContentSettingsProps) {
  const t = useTranslations("admin.settings.content");

  return (
    <div className="space-y-6">
      {/* Homepage Settings */}
      <div className="border-2 border-neo-border bg-neo-surface p-6 shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neo-border">
          <div className="w-10 h-10 flex items-center justify-center bg-[#00F0FF] border-2 border-neo-border">
            <Home className="h-5 w-5 text-neo-text" />
          </div>
          <div>
            <h3 className="font-black text-neo-text uppercase tracking-tight">{t("homepage")}</h3>
            <p className="text-xs font-mono text-neo-text/60">Configuration de la page d'accueil</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <NeoLabel htmlFor="homepageFeaturedAlbumsCount">{t("homepageFeaturedCount")}</NeoLabel>
            <NeoInput
              id="homepageFeaturedAlbumsCount"
              type="number"
              min={3}
              max={12}
              value={settings.homepageFeaturedAlbumsCount || 6}
              onChange={(e) => onChange("homepageFeaturedAlbumsCount", parseInt(e.target.value))}
            />
          </div>

          <div>
            <NeoLabel htmlFor="homepageLatestVideosCount">{t("homepageLatestCount")}</NeoLabel>
            <NeoInput
              id="homepageLatestVideosCount"
              type="number"
              min={3}
              max={12}
              value={settings.homepageLatestVideosCount || 6}
              onChange={(e) => onChange("homepageLatestVideosCount", parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Pagination Settings */}
      <div className="border-2 border-neo-border bg-neo-surface p-6 shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neo-border">
          <div className="w-10 h-10 flex items-center justify-center bg-[#D5FF0A] border-2 border-neo-border">
            <LayoutGrid className="h-5 w-5 text-neo-text" />
          </div>
          <div>
            <h3 className="font-black text-neo-text uppercase tracking-tight">{t("pagination")}</h3>
            <p className="text-xs font-mono text-neo-text/60">Nombre d'éléments par page</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <NeoLabel htmlFor="albumsPerPage">{t("perPage.albums")}</NeoLabel>
            <NeoInput
              id="albumsPerPage"
              type="number"
              min={6}
              max={24}
              value={settings.albumsPerPage || 12}
              onChange={(e) => onChange("albumsPerPage", parseInt(e.target.value))}
            />
          </div>

          <div>
            <NeoLabel htmlFor="videosPerPage">{t("perPage.videos")}</NeoLabel>
            <NeoInput
              id="videosPerPage"
              type="number"
              min={6}
              max={24}
              value={settings.videosPerPage || 12}
              onChange={(e) => onChange("videosPerPage", parseInt(e.target.value))}
            />
          </div>

          <div>
            <NeoLabel htmlFor="servicesPerPage">{t("perPage.services")}</NeoLabel>
            <NeoInput
              id="servicesPerPage"
              type="number"
              min={5}
              max={20}
              value={settings.servicesPerPage || 10}
              onChange={(e) => onChange("servicesPerPage", parseInt(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Sorting Settings */}
      <div className="border-2 border-neo-border bg-neo-surface p-6 shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neo-border">
          <div className="w-10 h-10 flex items-center justify-center bg-[#FF006E] border-2 border-neo-border">
            <ArrowUpDown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-neo-text uppercase tracking-tight">{t("sorting")}</h3>
            <p className="text-xs font-mono text-neo-text/60">Tri par défaut des contenus</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <NeoLabel htmlFor="defaultAlbumSort">{t("sortLabel.albums")}</NeoLabel>
            <NeoSelect
              id="defaultAlbumSort"
              value={settings.defaultAlbumSort || "date_desc"}
              onChange={(value) => onChange("defaultAlbumSort", value)}
              options={[
                { value: "date_desc", label: t("sortOptions.date_desc") },
                { value: "date_asc", label: t("sortOptions.date_asc") },
                { value: "title_asc", label: t("sortOptions.title_asc") },
                { value: "title_desc", label: t("sortOptions.title_desc") },
              ]}
            />
          </div>

          <div>
            <NeoLabel htmlFor="defaultVideoSort">{t("sortLabel.videos")}</NeoLabel>
            <NeoSelect
              id="defaultVideoSort"
              value={settings.defaultVideoSort || "date_desc"}
              onChange={(value) => onChange("defaultVideoSort", value)}
              options={[
                { value: "date_desc", label: t("sortOptions.date_desc") },
                { value: "date_asc", label: t("sortOptions.date_asc") },
                { value: "title_asc", label: t("sortOptions.title_asc") },
                { value: "title_desc", label: t("sortOptions.title_desc") },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
