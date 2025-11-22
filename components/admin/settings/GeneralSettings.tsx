"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Mail, Phone, MapPin } from "lucide-react";

interface GeneralSettingsProps {
  settings: any;
  onChange: (field: string, value: any) => void;
}

export function GeneralSettings({ settings, onChange }: GeneralSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Informations Générales
          </CardTitle>
          <CardDescription>
            Paramètres de base affichés sur le site public
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteTitle">Titre du site</Label>
            <Input
              id="siteTitle"
              value={settings.siteTitle || ""}
              onChange={(e) => onChange("siteTitle", e.target.value)}
              placeholder="Loïc Ghanem | Music Composer & Producer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription || ""}
              onChange={(e) => onChange("siteDescription", e.target.value)}
              placeholder="Award-winning music composer and producer..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email de contact
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail || ""}
                onChange={(e) => onChange("contactEmail", e.target.value)}
                placeholder="contact@loicghanem.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Téléphone (optionnel)
              </Label>
              <Input
                id="contactPhone"
                type="tel"
                value={settings.contactPhone || ""}
                onChange={(e) => onChange("contactPhone", e.target.value)}
                placeholder="+33 X XX XX XX XX"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Localisation
            </Label>
            <Input
              id="location"
              value={settings.location || ""}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="Paris, France"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="footerBio">Bio courte pour le footer (optionnel)</Label>
            <Textarea
              id="footerBio"
              value={settings.footerBio || ""}
              onChange={(e) => onChange("footerBio", e.target.value)}
              placeholder="Compositeur & Producteur Musical basé à Paris"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
