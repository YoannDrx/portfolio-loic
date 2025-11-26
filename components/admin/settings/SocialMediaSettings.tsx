"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface SocialMediaSettingsProps {
  settings: Record<string, string | undefined>;
  onChange: (field: string, value: string) => void;
}

const socialPlatforms = [
  { key: "socialYoutube", label: "YouTube", placeholder: "https://youtube.com/@loicghanem" },
  { key: "socialInstagram", label: "Instagram", placeholder: "https://instagram.com/loicghanem" },
  { key: "socialFacebook", label: "Facebook", placeholder: "https://facebook.com/loicghanem" },
  { key: "socialTwitter", label: "Twitter / X", placeholder: "https://twitter.com/loicghanem" },
  { key: "socialLinkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/loicghanem" },
  { key: "socialSoundcloud", label: "SoundCloud", placeholder: "https://soundcloud.com/loicghanem" },
  { key: "socialSpotify", label: "Spotify", placeholder: "https://open.spotify.com/artist/..." },
  { key: "socialAppleMusic", label: "Apple Music", placeholder: "https://music.apple.com/..." },
  { key: "socialBandcamp", label: "Bandcamp", placeholder: "https://loicghanem.bandcamp.com" },
  { key: "socialTiktok", label: "TikTok", placeholder: "https://tiktok.com/@loicghanem" },
];

export function SocialMediaSettings({ settings, onChange }: SocialMediaSettingsProps) {
  const t = useTranslations("admin.settings.social");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialPlatforms.map((platform) => (
              <div key={platform.key} className="space-y-2">
                <Label htmlFor={platform.key}>{platform.label}</Label>
                <Input
                  id={platform.key}
                  type="url"
                  value={settings[platform.key] || ""}
                  onChange={(e) => onChange(platform.key, e.target.value)}
                  placeholder={platform.placeholder}
                />
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            {t("tip")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
