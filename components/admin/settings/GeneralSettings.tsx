import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

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

export function GeneralSettings({ settings, onChange }: GeneralSettingsProps) {
  const t = useTranslations("admin.settings.general");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="siteTitle">{t("siteTitle")}</Label>
            <Input
              id="siteTitle"
              value={settings.siteTitle || ""}
              onChange={(e) => onChange("siteTitle", e.target.value)}
              placeholder="Loïc Ghanem | Music Composer & Producer"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="siteDescription">{t("description")}</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription || ""}
              onChange={(e) => onChange("siteDescription", e.target.value)}
              placeholder="Award-winning music composer and producer..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="footerBio">{t("footerBio")}</Label>
            <Textarea
              id="footerBio"
              value={settings.footerBio || ""}
              onChange={(e) => onChange("footerBio", e.target.value)}
              placeholder="Compositeur & Producteur Musical basé à Paris"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contactEmail">{t("contactEmail")}</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail || ""}
                onChange={(e) => onChange("contactEmail", e.target.value)}
                placeholder="contact@loicghanem.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contactPhone">{t("contactPhone")}</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={settings.contactPhone || ""}
                onChange={(e) => onChange("contactPhone", e.target.value)}
                placeholder="+33 X XX XX XX XX"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">{t("location")}</Label>
            <Input
              id="location"
              value={settings.location || ""}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="Paris, France"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
