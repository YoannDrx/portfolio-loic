"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { VersionHistory } from "@/components/admin/VersionHistory";
import { Loader2, Download, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { videoCreateSchema, type VideoCreateInput } from "@/lib/validations/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

interface VideoFormProps {
  initialData?: VideoCreateInput & { id?: string };
  locale: string;
}

const TYPES = [
  { value: "OriginalMusic", label: "Original Music" },
  { value: "Sync", label: "Sync" },
  { value: "MusicToPicture", label: "Music to Picture" },
];

// Helper: Extraire l'ID YouTube depuis une URL
function extractYouTubeID(input: string): string | null {
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
    return input.trim();
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

// Helper: Générer l'URL du thumbnail YouTube
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function VideoForm({ initialData, locale }: VideoFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const form = useForm<VideoCreateInput>({
    resolver: zodResolver(videoCreateSchema),
    defaultValues: initialData || {
      img: "",
      type: "OriginalMusic",
      videoId: "",
      title: "",
      date: "",
      published: false,
      order: 0,
    },
    mode: "onBlur",
  });

  const {
    formState: { isSubmitting, isDirty },
    watch,
    setValue,
  } = form;

  const videoId = watch("videoId");
  const img = watch("img");

  // Auto-fetch thumbnail quand videoId change
  useEffect(() => {
    if (videoId && videoId.length === 11 && !img) {
      const thumbnail = getYouTubeThumbnail(videoId);
      setValue("img", thumbnail);
    }
  }, [videoId, img, setValue]);

  async function onSubmit(data: VideoCreateInput) {
    try {
      const url = isEditing
        ? `/api/admin/videos/${initialData.id}`
        : "/api/admin/videos";

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la sauvegarde");
      }

      toast({
        title: isEditing ? "Vidéo modifiée ✓" : "Vidéo créée ✓",
        description: `La vidéo "${data.title}" a été ${isEditing ? "modifiée" : "créée"} avec succès.`,
      });

      router.push(`/${locale}/admin/videos`);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue.",
      });
    }
  }

  function handleVideoIdChange(value: string) {
    const extractedId = extractYouTubeID(value);

    if (extractedId) {
      setValue("videoId", extractedId, { shouldValidate: true });
      setValue("img", getYouTubeThumbnail(extractedId));

      toast({
        title: "ID YouTube détecté ✓",
        description: `ID: ${extractedId} - Thumbnail auto-rempli`,
      });
    } else {
      setValue("videoId", value, { shouldValidate: true });
    }
  }

  function fetchThumbnail() {
    const currentVideoId = form.getValues("videoId");
    if (!currentVideoId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez d'abord renseigner l'ID de la vidéo",
      });
      return;
    }

    const thumbnail = getYouTubeThumbnail(currentVideoId);
    setValue("img", thumbnail);

    toast({
      title: "Thumbnail récupéré ✓",
      description: "L'URL du thumbnail YouTube a été auto-remplie",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isDirty && !isSubmitting && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Vous avez des modifications non enregistrées.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Informations de la vidéo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Titre de la vidéo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="videoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID ou URL YouTube *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => handleVideoIdChange(e.target.value)}
                        placeholder="dQw4w9WgXcQ ou https://youtube.com/..."
                      />
                    </FormControl>
                    <FormDescription>
                      Collez l&apos;URL complète ou l&apos;ID YouTube (détection automatique)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="DD/MM/YYYY" />
                    </FormControl>
                    <FormDescription>Format: DD/MM/YYYY</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="img"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-2">
                      <FormLabel>URL du thumbnail *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://img.youtube.com/vi/..." />
                      </FormControl>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={fetchThumbnail}
                      disabled={!videoId}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Auto-fetch
                    </Button>
                  </div>
                  <FormDescription>
                    Le thumbnail est auto-rempli depuis YouTube
                  </FormDescription>
                  <FormMessage />

                  {/* Preview */}
                  {field.value && (
                    <div className="relative mt-2 aspect-video w-full max-w-md overflow-hidden rounded-lg border">
                      <Image
                        src={field.value}
                        alt="Preview"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordre d&apos;affichage</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Nombre plus petit = affiché en premier
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === "true")}
                      defaultValue={field.value ? "true" : "false"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Publié</SelectItem>
                        <SelectItem value="false">Brouillon</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Enregistrer les modifications" : "Créer la vidéo"}
          </Button>

          {isEditing && (
            <VersionHistory
              contentType="video"
              contentId={initialData.id as string}
            />
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (isDirty && !confirm("Modifications non enregistrées. Continuer ?")) {
                return;
              }
              router.push(`/${locale}/admin/videos`);
            }}
          >
            Annuler
          </Button>

          {isDirty && (
            <span className="text-sm text-muted-foreground">
              Modifications non enregistrées
            </span>
          )}
        </div>
      </form>
    </Form>
  );
}
