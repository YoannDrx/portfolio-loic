"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { VersionHistory } from "@/components/admin/VersionHistory";
import { Loader2, AlertCircle, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { albumCreateSchema, type AlbumCreateInput } from "@/lib/validations/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AlbumFormProps {
  initialData?: AlbumCreateInput & { id?: string };
  locale: string;
}

const STYLES = [
  { value: "film", label: "Film" },
  { value: "music-video", label: "Music Video" },
  { value: "concert", label: "Concert" },
  { value: "session", label: "Session" },
  { value: "other", label: "Autre" },
];

export function AlbumForm({ initialData, locale }: AlbumFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const form = useForm<AlbumCreateInput>({
    resolver: zodResolver(albumCreateSchema),
    defaultValues: initialData || {
      title: "",
      img: "",
      poster: "",
      date: "",
      sortedDate: "",
      style: "film",
      listenLink: "",
      collabName: "",
      collabLink: "",
      descriptionsFr: "",
      descriptionsEn: "",
      published: false,
      order: 0,
    },
    mode: "onBlur", // Validation au blur pour meilleure UX
  });

  const {
    formState: { isSubmitting, isDirty, errors },
  } = form;

  async function onSubmit(data: AlbumCreateInput) {
    try {
      const url = isEditing
        ? `/api/admin/albums/${initialData.id}`
        : "/api/admin/albums";

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de la sauvegarde");
      }

      const album = await response.json();

      toast({
        title: isEditing ? "Album modifié ✓" : "Album créé ✓",
        description: `L'album "${data.title}" a été ${isEditing ? "modifié" : "créé"} avec succès.`,
      });

      router.push(`/${locale}/admin/albums`);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue lors de la sauvegarde.",
      });
    }
  }

  // Alerte si formulaire modifié
  const showDirtyWarning = isDirty && !isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Alerte formulaire modifié */}
        {showDirtyWarning && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Vous avez des modifications non enregistrées.
            </AlertDescription>
          </Alert>
        )}

        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
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
                      <Input {...field} placeholder="Nom de l'album" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Style *</FormLabel>
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
                        {STYLES.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
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
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date affichée *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Septembre 2024" />
                    </FormControl>
                    <FormDescription>
                      Format libre (ex: "Juin 2024", "Été 2024")
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sortedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de tri *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="MM-YYYY" />
                    </FormControl>
                    <FormDescription>Format: MM-YYYY (ex: 09-2024)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="img"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Image de couverture *"
                        description="Format: JPEG, PNG, WebP (max 5MB)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="poster"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Poster *"
                        description="Format: JPEG, PNG, WebP (max 5MB)"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="listenLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lien d&apos;écoute *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://open.spotify.com/..."
                    />
                  </FormControl>
                  <FormDescription>
                    Lien Spotify, Apple Music, ou autre plateforme d&apos;écoute
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="collabName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la collaboration</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom de l'artiste" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collabLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lien de la collaboration</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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

        {/* Description français */}
        <Card>
          <CardHeader>
            <CardTitle>Description en français *</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="descriptionsFr"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Description en français..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Description anglais */}
        <Card>
          <CardHeader>
            <CardTitle>Description en anglais *</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="descriptionsEn"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      placeholder="Description in English..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Enregistrer les modifications" : "Créer l'album"}
          </Button>

          {isEditing && (
            <>
              <Button type="button" variant="outline" asChild>
                <Link
                  href={`/${locale}/albums/${initialData.id}?preview=true`}
                  target="_blank"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Prévisualiser
                </Link>
              </Button>

              <VersionHistory
                contentType="album"
                contentId={initialData.id as string}
              />
            </>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (isDirty) {
                const confirm = window.confirm(
                  "Vous avez des modifications non enregistrées. Voulez-vous vraiment annuler ?"
                );
                if (!confirm) return;
              }
              router.push(`/${locale}/admin/albums`);
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
