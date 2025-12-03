"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

interface ProfileSettingsProps {
  user: {
    email?: string;
    name?: string;
  };
  onUserUpdate: () => void;
}

export function ProfileSettings({ user, onUserUpdate }: ProfileSettingsProps) {
  const t = useTranslations("admin.settings.profile");
  const tCommon = useTranslations("admin.common");

  // Email change state
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Changer l'email
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail || newEmail === user.email) {
      toast({
        variant: "destructive",
        title: t("invalidEmail"),
        description: t("enterDifferentEmail"),
      });
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast({
        variant: "destructive",
        title: t("invalidEmail"),
        description: t("enterValidEmail"),
      });
      return;
    }

    setEmailLoading(true);
    try {
      const response = await fetch("/api/admin/profile/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("errorEmail"));
      }

      toast({
        title: `${t("successEmail")} ✓`,
        description: t("successEmail"),
      });

      setNewEmail("");
      onUserUpdate();
    } catch (error) {
      const message = error instanceof Error ? error.message : t("errorEmail");
      toast({
        variant: "destructive",
        title: tCommon("error"),
        description: message,
      });
    } finally {
      setEmailLoading(false);
    }
  };

  // Changer le mot de passe
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        variant: "destructive",
        title: t("requiredFields"),
        description: t("fillAllFields"),
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: t("passwordTooShort"),
        description: t("passwordShortDesc"),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: t("passwordMismatch"),
        description: t("passwordMismatchDesc"),
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch("/api/admin/profile/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("errorPassword"));
      }

      toast({
        title: `${t("successPassword")} ✓`,
        description: t("successPassword"),
      });

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: tCommon("error"),
        description: error instanceof Error ? error.message : t("errorPassword"),
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informations du profil */}
      <Card className="xs:px-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("name")}</Label>
            <Input value={user.name || "Administrateur"} disabled />
          </div>

          <div className="space-y-2">
            <Label>{t("currentEmail")}</Label>
            <Input value={user.email} disabled />
          </div>

          <div className="space-y-2">
            <Label>{t("role")}</Label>
            <Input value="Admin" disabled />
          </div>
        </CardContent>
      </Card>

      {/* Changer l'email */}
      <Card className="xs:px-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t("changeEmail")}
          </CardTitle>
          <CardDescription>{t("changeEmailDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail">{t("newEmail")}</Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="nouveau@email.com"
                disabled={emailLoading}
              />
            </div>

            <Button type="submit" disabled={emailLoading} className="gap-2">
              {emailLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("updating")}
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  {t("updateEmail")}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Changer le mot de passe */}
      <Card className="xs:px-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {t("changePassword")}
          </CardTitle>
          <CardDescription>{t("changePasswordDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={passwordLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={passwordLoading}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">{t("newPassword")}</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={passwordLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={passwordLoading}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">{t("minChars")}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={passwordLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={passwordLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={passwordLoading} className="gap-2">
              {passwordLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("updating")}
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  {t("updatePassword")}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
