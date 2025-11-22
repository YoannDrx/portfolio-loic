"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { serviceCreateSchema, type ServiceCreateInput } from "@/lib/validations/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ServiceFormProps {
  initialData?: ServiceCreateInput & { id?: string };
  locale: string;
}

export function ServiceForm({ initialData, locale }: ServiceFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const form = useForm<ServiceCreateInput>({
    resolver: zodResolver(serviceCreateSchema),
    defaultValues: initialData || {
      no: "01",
      title: "",
      text: "",
      largeImg: "",
      largeTitle: "",
      poster: "",
      date: "",
      author: "",
      fullDescription: "",
      descriptionsFr: "",
      descriptionsEn: "",
      published: false,
      order: 0,
    },
    mode: "onBlur",
  });

  const {
    formState: { isSubmitting, isDirty },
  } = form;

  async function onSubmit(data: ServiceCreateInput) {
    try {
      const url = isEditing
        ? `/api/admin/services/${initialData.id}`
        : "/api/admin/services";

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
        title: isEditing ? "Service modifié ✓" : "Service créé ✓",
        description: `Le service "${data.title}" a été ${isEditing ? "modifié" : "créé"} avec succès.`,
      });

      router.push(`/${locale}/admin/services`);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue.",
      });
    }
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
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="01" />
                    </FormControl>
                    <FormDescription>Format: 01, 02, 03...</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom du service" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="largeTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre large *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Titre de la section" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description courte *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Description courte visible sur la carte"
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum 500 caractères - Description visible sur la carte
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description complète *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Description détaillée du service"
                      rows={5}
                    />
                  </FormControl>
                  <FormDescription>
                    Description détaillée visible sur la page du service
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auteur *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom de l'auteur" />
                    </FormControl>
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
                      <Input {...field} placeholder="Ex: Janvier 2024" />
                    </FormControl>
                    <FormDescription>Format libre</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="largeImg"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Image large *"
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

        <Card>
          <CardHeader>
            <CardTitle>Description détaillée en français *</CardTitle>
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
                      placeholder="Description détaillée en français..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description détaillée en anglais *</CardTitle>
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
                      placeholder="Detailed description in English..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Enregistrer les modifications" : "Créer le service"}
          </Button>

          {isEditing && (
            <VersionHistory
              contentType="service"
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
              router.push(`/${locale}/admin/services`);
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
