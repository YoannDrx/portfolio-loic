"use client";

import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ProfileSettingsProps {
  user: {
    email?: string;
    name?: string;
  };
  onUserUpdate: () => void;
}

// Neo-brutalist button component
const NeoButton = ({ children, onClick, disabled, type = "button", variant = "default" }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "default" | "accent";
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "flex items-center gap-2 px-5 py-3",
      "font-mono text-sm font-bold uppercase tracking-wide",
      "border-2 border-neo-border",
      "shadow-[3px_3px_0px_0px_var(--neo-shadow)]",
      "hover:shadow-[4px_4px_0px_0px_var(--neo-shadow)]",
      "hover:-translate-y-0.5",
      "transition-all duration-200",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0",
      variant === "default" && "bg-neo-surface text-neo-text",
      variant === "accent" && "bg-neo-accent text-neo-text-inverse"
    )}
  >
    {children}
  </button>
);

// Neo-brutalist input component
const NeoInput = ({ id, value, onChange, placeholder, type = "text", disabled, icon: Icon, rightElement }: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  icon?: typeof User;
  rightElement?: React.ReactNode;
}) => (
  <div className="relative">
    {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neo-text/40" />}
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "w-full py-3 bg-neo-surface border-2 border-neo-border",
        "text-neo-text font-mono text-sm placeholder:text-neo-text/40",
        "focus:outline-none focus:border-neo-accent",
        "shadow-[2px_2px_0px_0px_var(--neo-shadow)]",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-neo-bg-alt",
        Icon ? "pl-10 pr-4" : "px-4",
        rightElement && "pr-12"
      )}
    />
    {rightElement && (
      <div className="absolute right-1 top-1/2 -translate-y-1/2">
        {rightElement}
      </div>
    )}
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
        title: `${t("successEmail")}`,
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
        title: `${t("successPassword")}`,
        description: t("successPassword"),
      });

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

  const PasswordToggle = ({ show, onToggle, disabled }: { show: boolean; onToggle: () => void; disabled: boolean }) => (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className="p-2 text-neo-text/40 hover:text-neo-text transition-colors disabled:opacity-50"
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Informations du profil */}
      <div className="border-2 border-neo-border bg-neo-surface p-6 shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neo-border">
          <div className="w-10 h-10 flex items-center justify-center bg-[#00F0FF] border-2 border-neo-border">
            <User className="h-5 w-5 text-neo-text" />
          </div>
          <div>
            <h3 className="font-black text-neo-text uppercase tracking-tight">{t("title")}</h3>
            <p className="text-xs font-mono text-neo-text/60">{t("description")}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <NeoLabel htmlFor="userName">{t("name")}</NeoLabel>
            <NeoInput id="userName" value={user.name || "Administrateur"} onChange={() => {}} disabled icon={User} />
          </div>

          <div>
            <NeoLabel htmlFor="userEmail">{t("currentEmail")}</NeoLabel>
            <NeoInput id="userEmail" value={user.email || ""} onChange={() => {}} disabled icon={Mail} />
          </div>

          <div>
            <NeoLabel htmlFor="userRole">{t("role")}</NeoLabel>
            <NeoInput id="userRole" value="Admin" onChange={() => {}} disabled />
          </div>
        </div>
      </div>

      {/* Changer l'email */}
      <div className="border-2 border-neo-border bg-neo-surface p-6 shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neo-border">
          <div className="w-10 h-10 flex items-center justify-center bg-[#D5FF0A] border-2 border-neo-border">
            <Mail className="h-5 w-5 text-neo-text" />
          </div>
          <div>
            <h3 className="font-black text-neo-text uppercase tracking-tight">{t("changeEmail")}</h3>
            <p className="text-xs font-mono text-neo-text/60">{t("changeEmailDesc")}</p>
          </div>
        </div>

        <form onSubmit={handleEmailChange} className="space-y-4">
          <div>
            <NeoLabel htmlFor="newEmail">{t("newEmail")}</NeoLabel>
            <NeoInput
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="nouveau@email.com"
              disabled={emailLoading}
              icon={Mail}
            />
          </div>

          <NeoButton type="submit" disabled={emailLoading} variant="accent">
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
          </NeoButton>
        </form>
      </div>

      {/* Changer le mot de passe */}
      <div className="border-2 border-neo-border bg-neo-surface p-6 shadow-[3px_3px_0px_0px_var(--neo-shadow)]">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-neo-border">
          <div className="w-10 h-10 flex items-center justify-center bg-[#FF006E] border-2 border-neo-border">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-neo-text uppercase tracking-tight">{t("changePassword")}</h3>
            <p className="text-xs font-mono text-neo-text/60">{t("changePasswordDesc")}</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <NeoLabel htmlFor="currentPassword">{t("currentPassword")}</NeoLabel>
            <NeoInput
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              disabled={passwordLoading}
              icon={Lock}
              rightElement={<PasswordToggle show={showCurrentPassword} onToggle={() => setShowCurrentPassword(!showCurrentPassword)} disabled={passwordLoading} />}
            />
          </div>

          <div>
            <NeoLabel htmlFor="newPassword">{t("newPassword")}</NeoLabel>
            <NeoInput
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              disabled={passwordLoading}
              icon={Lock}
              rightElement={<PasswordToggle show={showNewPassword} onToggle={() => setShowNewPassword(!showNewPassword)} disabled={passwordLoading} />}
            />
            <p className="text-xs font-mono text-neo-text/50 mt-1">{t("minChars")}</p>
          </div>

          <div>
            <NeoLabel htmlFor="confirmPassword">{t("confirmPassword")}</NeoLabel>
            <NeoInput
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={passwordLoading}
              icon={Lock}
              rightElement={<PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} disabled={passwordLoading} />}
            />
          </div>

          <NeoButton type="submit" disabled={passwordLoading} variant="accent">
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
          </NeoButton>
        </form>
      </div>
    </div>
  );
}
