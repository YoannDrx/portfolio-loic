"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { resumeEntryCreateSchema, type ResumeEntryCreateFormInput } from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

interface ResumeFormProps {
  initialData?: Partial<ResumeEntryCreateFormInput> & { id?: string };
  locale: string;
  isEditing?: boolean;
}

export function ResumeForm({ initialData, locale, isEditing }: ResumeFormProps) {
  const router = useRouter();
  const form = useForm<ResumeEntryCreateFormInput>({
    resolver: zodResolver(resumeEntryCreateSchema),
    defaultValues: initialData || {
      type: "EXPERIENCE",
      titleEn: "",
      titleFr: "",
      subtitleEn: "",
      subtitleFr: "",
      dateRangeEn: "",
      dateRangeFr: "",
      descriptionEn: "",
      descriptionFr: "",
      value: 0,
      link: "",
      published: true,
      order: 0,
    },
  });

  const onSubmit = async (data: ResumeEntryCreateFormInput) => {
    try {
      const url = isEditing && initialData?.id
        ? `/api/admin/resume/${initialData.id}`
        : "/api/admin/resume";
      const method = isEditing ? "PATCH" : "POST";

      // Ensure defaults for optional fields
      const payload = {
        ...data,
        published: data.published ?? true,
        order: data.order ?? 0,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Something went wrong");

      toast({ title: isEditing ? "Updated successfully" : "Created successfully" });
      router.push(`/${locale}/admin/resume`);
      router.refresh();
    } catch {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
        
        {/* General Info Section */}
        <GlassCard className="p-6 space-y-6">
          <h3 className="text-xl font-bold text-white border-b border-[var(--glass-border)] pb-2 mb-4">General Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/85">Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-[var(--glass-subtle)] border-[var(--glass-border)] text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-obsidian border-[var(--glass-border)] text-white">
                      <SelectItem value="EXPERIENCE">Experience</SelectItem>
                      <SelectItem value="EDUCATION">Education</SelectItem>
                      <SelectItem value="SKILL">Skill</SelectItem>
                      <SelectItem value="LANGUAGE">Language</SelectItem>
                      <SelectItem value="INTEREST">Interest</SelectItem>
                      <SelectItem value="KNOWLEDGE">Knowledge</SelectItem>
                      <SelectItem value="AWARD">Award</SelectItem>
                      <SelectItem value="CLIENT">Client / Sync</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
             <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/85">Order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="bg-[var(--glass-subtle)] border-[var(--glass-border)] text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/85">Value (0-100 for Skills)</FormLabel>
                  <FormControl>
                     <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} value={field.value || 0} className="bg-[var(--glass-subtle)] border-[var(--glass-border)] text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/85">Link (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} className="bg-[var(--glass-subtle)] border-[var(--glass-border)] text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </GlassCard>

        {/* English Content Section */}
        <GlassCard className="p-6 space-y-6">
           <h3 className="text-xl font-bold text-neon-cyan border-b border-[var(--glass-border)] pb-2 mb-4">English Content</h3>
           <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="titleEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/85">Title (EN)</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-[var(--glass-subtle)] border-[var(--glass-border)] text-white" placeholder="e.g. Music Producer" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subtitleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/85">Subtitle (EN)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} className="bg-[var(--glass-subtle)] border-[var(--glass-border)] text-white" placeholder="e.g. Sony Music" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateRangeEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/85">Date Range (EN)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 2020 - Present" value={field.value || ''} className="bg-[var(--glass-subtle)] border-[var(--glass-border)] text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descriptionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/85">Description (EN)</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="h-24 bg-[var(--glass-subtle)] border-[var(--glass-border)] text-white" value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           </div>
        </GlassCard>

        {/* French Content Section */}
        <GlassCard className="p-6 space-y-6">
           <h3 className="text-xl font-bold text-neon-magenta border-b border-[var(--glass-border)] pb-2 mb-4">French Content</h3>
           <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="titleFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/85">Title (FR)</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-[var(--glass-subtle)] border-[var(--glass-border)] text-white" placeholder="ex. Producteur de Musique" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subtitleFr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/85">Subtitle (FR)</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} className="bg-[var(--glass-subtle)] border-[var(--glass-border)] text-white" placeholder="ex. Sony Music" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateRangeFr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/85">Date Range (FR)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ex. 2020 - Aujourd'hui" value={field.value || ''} className="bg-[var(--glass-subtle)] border-[var(--glass-border)] text-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descriptionFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/85">Description (FR)</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="h-24 bg-[var(--glass-subtle)] border-[var(--glass-border)] text-white" value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           </div>
        </GlassCard>

        {/* Visibility Section */}
        <GlassCard className="p-6">
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border border-[var(--glass-border)] p-4 bg-[var(--glass-subtle)]">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-neon-lime data-[state=checked]:bg-neon-lime data-[state=checked]:text-obsidian"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-white font-medium cursor-pointer">
                    Published
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    This entry will be visible on the generated CV.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </GlassCard>

        <div className="flex gap-4 pt-4">
          <NeonButton type="submit" color="lime">
            {isEditing ? "Update Entry" : "Create Entry"}
          </NeonButton>
          <Button 
            type="button" 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground hover:bg-[var(--glass-active)]" 
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
