"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
}

// Helper pour valider si une URL est valide pour l'affichage
function isValidImageUrl(url: string | null | undefined): url is string {
  if (!url || url.trim() === "") return false;

  // Accepter les blob URLs
  if (url.startsWith("blob:")) return true;

  // Accepter les URLs qui commencent par http:// ou https://
  if (url.startsWith("http://") || url.startsWith("https://")) return true;

  // Accepter les chemins relatifs qui commencent par /
  if (url.startsWith("/")) return true;

  return false;
}

export function ImageUpload({
  value,
  onChange,
  label,
  description,
}: ImageUploadProps) {
  const t = useTranslations("admin");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(
    isValidImageUrl(value) ? value : null
  );
  const { toast } = useToast();

  const finalLabel = label || "Image"; // Fallback generic or use t if I add generic label key
  const finalDescription = description || `${t("media.dropzone")} (${t("media.maxSize")})`;

  // Synchroniser preview avec value quand il change de l'extérieur
  useEffect(() => {
    // Ne pas écraser preview si on est en train d'uploader
    if (!uploading) {
      const isValid = isValidImageUrl(value);
      setPreview(isValid ? value : null);
    }
  }, [value, uploading]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Créer une preview locale immédiatement
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);
      setUploading(true);
      setProgress(0);

      try {
        // Simuler la progression (cosmétique)
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        // Upload vers l'API
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || t("media.error"));
        }

        const data = await response.json();
        setProgress(100);

        // Nettoyer la preview locale et utiliser l'URL du serveur
        URL.revokeObjectURL(localPreview);
        setPreview(data.url);
        onChange(data.url);

        toast({
          title: t("media.success"),
          description: `${file.name} ${t("common.success").toLowerCase()}`, // Or customized message
        });
      } catch (error) {
        // En cas d'erreur, supprimer la preview
        URL.revokeObjectURL(localPreview);
        setPreview(value || null);

        toast({
          variant: "destructive",
          title: t("media.error"),
          description:
            error instanceof Error ? error.message : t("common.error"),
        });
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onChange, toast, value, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    disabled: uploading,
  });

  const handleRemove = () => {
    if (preview) {
      // Si preview est un blob URL, le révoquer
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      onChange("");
    }
  };

  return (
    <div className="space-y-2">
      {finalLabel && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {finalLabel}
        </label>
      )}

      {isValidImageUrl(preview) ? (
        // Preview de l'image uploadée
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-contain"
            unoptimized={preview.startsWith("blob:")}
          />

          {/* Bouton supprimer */}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Progress bar pendant upload */}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-64 space-y-2 rounded-lg bg-white p-4 dark:bg-gray-900">
                <div className="flex items-center justify-between text-sm">
                  <span>{t("media.uploading")}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Zone de drop
        <div
          {...getRootProps()}
          className={`
            flex cursor-pointer flex-col items-center justify-center gap-4
            rounded-lg border-2 border-dashed p-8 transition-colors
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
            }
            ${uploading ? "cursor-not-allowed opacity-50" : ""}
          `}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          ) : (
            <>
              {isDragActive ? (
                <Upload className="h-12 w-12 text-blue-500" />
              ) : (
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              )}

              <div className="text-center">
                <p className="text-sm font-medium text-foreground/75 dark:text-foreground/85">
                  {isDragActive
                    ? t("media.dropzoneDrag")
                    : t("media.dropzone")}
                </p>
                {finalDescription && (
                  <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground">
                    {finalDescription}
                  </p>
                )}
              </div>
            </>
          )}

          {uploading && (
            <div className="w-64 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{t("media.uploading")}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* URL actuelle (fallback si pas de preview) */}
      {value && !preview && (
        <p className="text-xs text-muted-foreground dark:text-muted-foreground">
          {t("media.currentUrl")} : <span className="font-mono">{value}</span>
        </p>
      )}
    </div>
  );
}
