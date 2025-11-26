"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sliders } from "lucide-react";
import { useTranslations } from "next-intl";

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

export function ContentSettings({ settings, onChange }: ContentSettingsProps) {
  const t = useTranslations("admin.settings.content");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Homepage */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t("homepage")}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homepageFeaturedAlbumsCount">
                  {t("homepageFeaturedCount")}
                </Label>
                <Input
                  id="homepageFeaturedAlbumsCount"
                  type="number"
                  min="3"
                  max="12"
                  value={settings.homepageFeaturedAlbumsCount || 6}
                  onChange={(e) => onChange("homepageFeaturedAlbumsCount", parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homepageLatestVideosCount">
                  {t("homepageLatestCount")}
                </Label>
                <Input
                  id="homepageLatestVideosCount"
                  type="number"
                  min="3"
                  max="12"
                  value={settings.homepageLatestVideosCount || 6}
                  onChange={(e) => onChange("homepageLatestVideosCount", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t("pagination")}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="albumsPerPage">{t("perPage.albums")}</Label>
                <Input
                  id="albumsPerPage"
                  type="number"
                  min="6"
                  max="24"
                  value={settings.albumsPerPage || 12}
                  onChange={(e) => onChange("albumsPerPage", parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videosPerPage">{t("perPage.videos")}</Label>
                <Input
                  id="videosPerPage"
                  type="number"
                  min="6"
                  max="24"
                  value={settings.videosPerPage || 12}
                  onChange={(e) => onChange("videosPerPage", parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servicesPerPage">{t("perPage.services")}</Label>
                <Input
                  id="servicesPerPage"
                  type="number"
                  min="5"
                  max="20"
                  value={settings.servicesPerPage || 10}
                  onChange={(e) => onChange("servicesPerPage", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Tri par défaut */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t("sorting")}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultAlbumSort">{t("sortLabel.albums")}</Label>
                <Select
                  value={settings.defaultAlbumSort || "date_desc"}
                  onValueChange={(value) => onChange("defaultAlbumSort", value)}
                >
                  <SelectTrigger id="defaultAlbumSort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">{t("sortOptions.date_desc")}</SelectItem>
                    <SelectItem value="date_asc">{t("sortOptions.date_asc")}</SelectItem>
                    <SelectItem value="title_asc">{t("sortOptions.title_asc")}</SelectItem>
                    <SelectItem value="title_desc">{t("sortOptions.title_desc")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultVideoSort">{t("sortLabel.videos")}</Label>
                <Select
                  value={settings.defaultVideoSort || "date_desc"}
                  onValueChange={(value) => onChange("defaultVideoSort", value)}
                >
                  <SelectTrigger id="defaultVideoSort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">{t("sortOptions.date_desc")}</SelectItem>
                    <SelectItem value="date_asc">{t("sortOptions.date_asc")}</SelectItem>
                    <SelectItem value="title_asc">{t("sortOptions.title_asc")}</SelectItem>
                    <SelectItem value="title_desc">{t("sortOptions.title_desc")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
