'use client';

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
import { albumCreateSchema, type AlbumCreateFormInput } from "@/lib/validations/schemas";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslations } from "next-intl";

interface AlbumFormProps {
  initialData?: AlbumCreateFormInput & { id?: string };
  locale: string;
}

const STYLES = [
  { value: "film", label: "Film" },
  { value: "music-video", label: "Music Video" },
  { value: "concert", label: "Concert" },
  { value: "session", label: "Session" },
  { value: "other", label: "Other" },
];

export function AlbumForm({ initialData, locale }: AlbumFormProps) {
  const t = useTranslations("admin");
  const router = useRouter();
  const isEditing = !!initialData?.id;

  const form = useForm<AlbumCreateFormInput>({
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
    formState: { isSubmitting, isDirty, errors: _errors },
  } = form;

  async function onSubmit(data: AlbumCreateFormInput) {
    try {
      const url = isEditing
        ? `/api/admin/albums/${initialData.id}`
        : "/api/admin/albums";

      // Ensure defaults for optional fields
      const payload = {
        ...data,
        published: data.published ?? false,
        order: data.order ?? 0,
      };

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || t("common.error"));
      }

      await response.json();

      const action = isEditing ? t("common.updated") : t("common.created");
      toast({
        title: `${isEditing ? t("albums.form.successUpdate") : t("albums.form.successCreate")} ✓`,
        description: t("albums.form.successDesc", { title: data.title, action }),
      });

      router.push(`/${locale}/admin/albums`);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description:
          error instanceof Error ? error.message : t("common.error"),
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
              {t("common.dirtyWarning")}
            </AlertDescription>
          </Alert>
        )}

        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle>{t("albums.form.generalInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("albums.form.title")} *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("albums.form.titlePlaceholder")} />
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
                    <FormLabel>{t("albums.form.style")} *</FormLabel>
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
                    <FormLabel>{t("albums.form.date")} *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("albums.form.datePlaceholder")} />
                    </FormControl>
                    <FormDescription>
                      Format libre
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
                    <FormLabel>{t("albums.form.sortedDate")} *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("albums.form.sortedDatePlaceholder")} />
                    </FormControl>
                    <FormDescription>{t("albums.form.sortedDatePlaceholder")}</FormDescription>
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
                        label={`${t("albums.form.coverImage")} *`}
                        description={`${t("media.dropzone")} (${t("media.maxSize")})`}
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
                        label={`${t("albums.form.poster")} *`}
                        description={`${t("media.dropzone")} (${t("media.maxSize")})`}
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
                  <FormLabel>{t("albums.form.listenLink")} *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="url"
                      placeholder="https://open.spotify.com/..."
                    />
                  </FormControl>
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
                    <FormLabel>{t("albums.form.collabName")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t("albums.form.collabNamePlaceholder")} />
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
                    <FormLabel>{t("albums.form.collabLink")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder={t("albums.form.collabLinkPlaceholder")}
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
                    <FormLabel>{t("albums.form.order")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("albums.form.published")}</FormLabel>
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
                        <SelectItem value="true">{t("albums.form.status.published")}</SelectItem>
                        <SelectItem value="false">{t("albums.form.status.draft")}</SelectItem>
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
            <CardTitle>{t("albums.form.descFr")} *</CardTitle>
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
                      placeholder={`${t("albums.form.descFr")}...`}
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
            <CardTitle>{t("albums.form.descEn")} *</CardTitle>
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
                      placeholder={`${t("albums.form.descEn")}...`}
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
            {isEditing ? t("common.save") : t("albums.create")}
          </Button>

          {isEditing && (
            <>
              <Button type="button" variant="outline" asChild>
                <Link
                  href={`/${locale}/albums/${initialData.id}?preview=true`}
                  target="_blank"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {t("common.preview")}
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
                  t("common.dirtyWarning")
                );
                if (!confirm) return;
              }
              router.push(`/${locale}/admin/albums`);
            }}
          >
            {t("common.cancel")}
          </Button>

          {isDirty && (
            <span className="text-sm text-muted-foreground">
              {t("common.dirtyWarning")}
            </span>
          )}
        </div>
      </form>
    </Form>
  );
}
