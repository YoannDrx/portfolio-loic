"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProfileSettingsProps {
  user: any;
  onUserUpdate: () => void;
}

export function ProfileSettings({ user, onUserUpdate }: ProfileSettingsProps) {
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
        title: "Email invalide",
        description: "Veuillez entrer un nouvel email différent",
      });
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast({
        variant: "destructive",
        title: "Email invalide",
        description: "Veuillez entrer un email valide",
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
        throw new Error(error.message || "Erreur lors du changement d'email");
      }

      toast({
        title: "Email modifié ✓",
        description: "Votre email a été mis à jour avec succès",
      });

      setNewEmail("");
      onUserUpdate();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de changer l'email",
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
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 8 caractères",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Mots de passe différents",
        description: "Les nouveaux mots de passe ne correspondent pas",
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
        throw new Error(error.message || "Erreur lors du changement de mot de passe");
      }

      toast({
        title: "Mot de passe modifié ✓",
        description: "Votre mot de passe a été mis à jour avec succès",
      });

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de changer le mot de passe",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informations du profil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil Administrateur
          </CardTitle>
          <CardDescription>
            Informations de votre compte admin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nom</Label>
            <Input value={user.name || "Administrateur"} disabled />
          </div>

          <div className="space-y-2">
            <Label>Email actuel</Label>
            <Input value={user.email} disabled />
          </div>

          <div className="space-y-2">
            <Label>Rôle</Label>
            <Input value="Admin" disabled />
          </div>
        </CardContent>
      </Card>

      {/* Changer l'email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Changer l'Email
          </CardTitle>
          <CardDescription>
            Modifiez l'adresse email de connexion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail">Nouvel email</Label>
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
                  Modification...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Modifier l'Email
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Changer le mot de passe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Changer le Mot de Passe
          </CardTitle>
          <CardDescription>
            Modifiez votre mot de passe de connexion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
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
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
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
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 8 caractères
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
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
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={passwordLoading} className="gap-2">
              {passwordLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Modification...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Modifier le Mot de Passe
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
