"use client";

import { Share2, Youtube, Instagram, Facebook, Twitter, Linkedin, Music, Headphones } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface SocialMediaSettingsProps {
  settings: Record<string, string | undefined>;
  onChange: (field: string, value: string) => void;
}

const socialPlatforms = [
  { key: "socialYoutube", label: "YouTube", placeholder: "https://youtube.com/@loicghanem", icon: Youtube, color: "#FF0000" },
  { key: "socialInstagram", label: "Instagram", placeholder: "https://instagram.com/loicghanem", icon: Instagram, color: "#E4405F" },
  { key: "socialFacebook", label: "Facebook", placeholder: "https://facebook.com/loicghanem", icon: Facebook, color: "#1877F2" },
  { key: "socialTwitter", label: "Twitter / X", placeholder: "https://twitter.com/loicghanem", icon: Twitter, color: "#1DA1F2" },
  { key: "socialLinkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/loicghanem", icon: Linkedin, color: "#0A66C2" },
  { key: "socialSoundcloud", label: "SoundCloud", placeholder: "https://soundcloud.com/loicghanem", icon: Music, color: "#FF5500" },
  { key: "socialSpotify", label: "Spotify", placeholder: "https://open.spotify.com/artist/...", icon: Music, color: "#1DB954" },
  { key: "socialAppleMusic", label: "Apple Music", placeholder: "https://music.apple.com/...", icon: Headphones, color: "#FA243C" },
  { key: "socialBandcamp", label: "Bandcamp", placeholder: "https://loicghanem.bandcamp.com", icon: Music, color: "#629AA9" },
  { key: "socialTiktok", label: "TikTok", placeholder: "https://tiktok.com/@loicghanem", icon: Music, color: "#000000" },
];

// Neo-brutalist input component
const NeoInput = ({ id, value, onChange, placeholder, icon: Icon, iconColor }: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: typeof Youtube;
  iconColor?: string;
}) => (
  <div className="relative">
    {Icon && (
      <div
        className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center border-r-2 border-neo-border"
        style={{ backgroundColor: iconColor || "var(--neo-accent)" }}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>
    )}
    <input
      id={id}
      type="url"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(
        "w-full py-3 pr-4 bg-neo-surface border-2 border-neo-border",
        "text-neo-text font-mono text-sm placeholder:text-neo-text/40",
        "focus:outline-none focus:border-neo-accent",
        "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
        Icon ? "pl-14" : "px-4"
      )}
    />
  </div>
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

export function SocialMediaSettings({ settings, onChange }: SocialMediaSettingsProps) {
  const t = useTranslations("admin.settings.social");

  return (
    <div className="space-y-6">
      <div className="border-2 border-neo-border bg-neo-surface p-6 shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neo-border">
          <div className="w-10 h-10 flex items-center justify-center bg-[#8B5CF6] border-2 border-neo-border">
            <Share2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-neo-text uppercase tracking-tight">{t("title")}</h3>
            <p className="text-xs font-mono text-neo-text/60">{t("description")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {socialPlatforms.map((platform) => (
            <div key={platform.key}>
              <NeoLabel htmlFor={platform.key}>{platform.label}</NeoLabel>
              <NeoInput
                id={platform.key}
                value={settings[platform.key] || ""}
                onChange={(e) => onChange(platform.key, e.target.value)}
                placeholder={platform.placeholder}
                icon={platform.icon}
                iconColor={platform.color}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 border-2 border-neo-border bg-neo-bg-alt/50 border-l-4 border-l-[#D5FF0A]">
          <p className="text-xs font-mono text-neo-text/70">{t("tip")}</p>
        </div>
      </div>
    </div>
  );
}
