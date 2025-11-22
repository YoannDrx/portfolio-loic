"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sliders } from "lucide-react";

interface ContentSettingsProps {
  settings: any;
  onChange: (field: string, value: any) => void;
}

export function ContentSettings({ settings, onChange }: ContentSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            Paramètres de Contenu
          </CardTitle>
          <CardDescription>
            Configuration de l'affichage du contenu sur le site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Homepage */}
          <div className="space-y-4">
            <h3 className="font-semibold">Page d'accueil</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homepageFeaturedAlbumsCount">
                  Nombre d'albums featured
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
                  Nombre de vidéos latest
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
            <h3 className="font-semibold">Pagination</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="albumsPerPage">Albums par page</Label>
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
                <Label htmlFor="videosPerPage">Vidéos par page</Label>
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
                <Label htmlFor="servicesPerPage">Services par page</Label>
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
            <h3 className="font-semibold">Tri par défaut</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultAlbumSort">Albums</Label>
                <Select
                  value={settings.defaultAlbumSort || "date_desc"}
                  onValueChange={(value) => onChange("defaultAlbumSort", value)}
                >
                  <SelectTrigger id="defaultAlbumSort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Plus récent d'abord</SelectItem>
                    <SelectItem value="date_asc">Plus ancien d'abord</SelectItem>
                    <SelectItem value="title_asc">Titre A-Z</SelectItem>
                    <SelectItem value="title_desc">Titre Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultVideoSort">Vidéos</Label>
                <Select
                  value={settings.defaultVideoSort || "date_desc"}
                  onValueChange={(value) => onChange("defaultVideoSort", value)}
                >
                  <SelectTrigger id="defaultVideoSort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Plus récent d'abord</SelectItem>
                    <SelectItem value="date_asc">Plus ancien d'abord</SelectItem>
                    <SelectItem value="title_asc">Titre A-Z</SelectItem>
                    <SelectItem value="title_desc">Titre Z-A</SelectItem>
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
