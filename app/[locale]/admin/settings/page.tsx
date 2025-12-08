import { SettingsContent } from "@/components/admin/SettingsContent";

export const metadata = {
  title: "Paramètres | Admin",
  description: "Gérez les paramètres de votre portfolio",
};

export default async function SettingsPage() {
  return <SettingsContent />;
}
