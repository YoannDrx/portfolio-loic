import { z } from "zod";

// ============================================
// HELPERS & VALIDATORS
// ============================================

const urlSchema = z.string().url("URL invalide");
const dateStringSchema = z.string().min(1, "Date requise");
const htmlContentSchema = z.string().min(10, "Contenu trop court (minimum 10 caractères)");

// ============================================
// ALBUM SCHEMAS
// ============================================

export const albumCreateSchema = z.object({
  title: z
    .string()
    .min(1, "Titre requis")
    .max(200, "Titre trop long (maximum 200 caractères)"),
  img: urlSchema,
  poster: z.string().min(1, "Nom de l'artiste requis"),
  date: z.string().min(1, "Date d'affichage requise"),
  sortedDate: z
    .string()
    .regex(/^\d{2}-\d{4}$/, "Format de date invalide (attendu: MM-YYYY)"),
  style: z.string().min(1, "Style requis"),
  listenLink: urlSchema,
  spotifyEmbed: z.union([urlSchema, z.literal("")]).optional(),
  youtubeEmbed: z.union([urlSchema, z.literal("")]).optional(),
  collabName: z.string().optional(),
  collabLink: z.union([urlSchema, z.literal("")]).optional(),
  descriptionsFr: htmlContentSchema,
  descriptionsEn: htmlContentSchema,
  published: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export const albumUpdateSchema = albumCreateSchema.partial();

export type AlbumCreateInput = z.infer<typeof albumCreateSchema>;
export type AlbumCreateFormInput = z.input<typeof albumCreateSchema>;
export type AlbumUpdateInput = z.infer<typeof albumUpdateSchema>;

// ============================================
// VIDEO SCHEMAS
// ============================================

const videoTypes = ["OriginalMusic", "Sync", "MusicToPicture"] as const;

export const videoCreateSchema = z.object({
  img: urlSchema,
  type: z.enum(videoTypes, {
    message: "Type de vidéo invalide",
  }),
  videoId: z
    .string()
    .min(1, "ID YouTube requis")
    .regex(/^[a-zA-Z0-9_-]{11}$/, "ID YouTube invalide (11 caractères)"),
  title: z
    .string()
    .min(1, "Titre requis")
    .max(200, "Titre trop long (maximum 200 caractères)"),
  date: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Format de date invalide (attendu: DD/MM/YYYY)"),
  published: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export const videoUpdateSchema = videoCreateSchema.partial();

export type VideoCreateInput = z.infer<typeof videoCreateSchema>;
export type VideoCreateFormInput = z.input<typeof videoCreateSchema>;
export type VideoUpdateInput = z.infer<typeof videoUpdateSchema>;

// ============================================
// SERVICE SCHEMAS
// ============================================

export const serviceCreateSchema = z.object({
  no: z
    .string()
    .regex(/^\d{2}$/, "Numéro invalide (attendu: 01, 02, etc.)"),
  title: z
    .string()
    .min(1, "Titre requis")
    .max(200, "Titre trop long (maximum 200 caractères)"),
  text: z
    .string()
    .min(10, "Description courte trop courte (minimum 10 caractères)")
    .max(500, "Description courte trop longue (maximum 500 caractères)"),
  largeImg: urlSchema,
  largeTitle: z.string().min(1, "Titre large requis"),
  poster: z.string().min(1, "Poster requis"),
  date: dateStringSchema,
  author: z.string().min(1, "Auteur requis"),
  fullDescription: z
    .string()
    .min(10, "Description complète trop courte (minimum 10 caractères)"),
  descriptionsFr: htmlContentSchema,
  descriptionsEn: htmlContentSchema,
  published: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export const serviceUpdateSchema = serviceCreateSchema.partial();

export type ServiceCreateInput = z.infer<typeof serviceCreateSchema>;
export type ServiceCreateFormInput = z.input<typeof serviceCreateSchema>;
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;

// ============================================
// UPLOAD SCHEMA
// ============================================

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const uploadFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "La taille du fichier ne doit pas dépasser 5MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Format de fichier non supporté (JPEG, PNG, WebP uniquement)",
    }),
});

export type UploadFileInput = z.infer<typeof uploadFileSchema>;

// ============================================
// QUERY PARAMS SCHEMAS (pour recherche/filtrage)
// ============================================

export const albumsQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  style: z.string().optional(),
  published: z.coerce.boolean().optional(),
  sortBy: z.enum(["date", "title", "order", "createdAt", "sortedDate"]).default("sortedDate"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const videosQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  type: z.enum(videoTypes).optional(),
  published: z.coerce.boolean().optional(),
  sortBy: z.enum(["date", "title", "order", "createdAt"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const servicesQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  published: z.coerce.boolean().optional(),
  sortBy: z.enum(["order", "title", "createdAt"]).default("order"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type AlbumsQueryParams = z.infer<typeof albumsQuerySchema>;
export type VideosQueryParams = z.infer<typeof videosQuerySchema>;
export type ServicesQueryParams = z.infer<typeof servicesQuerySchema>;

// ============================================
// RESUME ENTRY SCHEMAS
// ============================================

export const resumeEntryCreateSchema = z.object({
  type: z.enum(["EXPERIENCE", "EDUCATION", "SKILL", "LANGUAGE", "INTEREST", "KNOWLEDGE", "AWARD", "CLIENT"]),
  titleEn: z.string().min(1, "Titre (EN) requis"),
  titleFr: z.string().min(1, "Titre (FR) requis"),
  subtitleEn: z.string().optional(),
  subtitleFr: z.string().optional(),
  dateRangeEn: z.string().optional(),
  dateRangeFr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionFr: z.string().optional(),
  value: z.number().min(0).max(100).optional(),
  link: z.union([urlSchema, z.literal("")]).optional(),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});

export const resumeEntryUpdateSchema = resumeEntryCreateSchema.partial();

export type ResumeEntryCreateInput = z.infer<typeof resumeEntryCreateSchema>;
export type ResumeEntryCreateFormInput = z.input<typeof resumeEntryCreateSchema>;
export type ResumeEntryUpdateInput = z.infer<typeof resumeEntryUpdateSchema>;

export const resumeEntriesQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  type: z.string().optional(),
  published: z.coerce.boolean().optional(),
  sortBy: z.enum(["order", "createdAt"]).default("order"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type ResumeEntriesQueryParams = z.infer<typeof resumeEntriesQuerySchema>;

// ============================================
// RESUME PROFILE / THEME / SECTION SCHEMAS
// ============================================

export const resumeProfileSchema = z.object({
  name: z.string().min(1),
  roleEn: z.string().min(1),
  roleFr: z.string().min(1),
  headlineEn: z.string().optional(),
  headlineFr: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  photo: z.string().optional(),
});

export type ResumeProfileInput = z.infer<typeof resumeProfileSchema>;

export const resumeThemeSchema = z.object({
  primary: z.string().min(1),
  secondary: z.string().min(1),
  accent: z.string().min(1),
  muted: z.string().min(1),
  sidebar: z.string().min(1),
  divider: z.string().min(1),
  gradientFrom: z.string().min(1),
  gradientTo: z.string().min(1),
  tagBg: z.string().min(1),
  tagText: z.string().min(1),
  fontHeadings: z.string().min(1),
  fontBody: z.string().min(1),
});

export type ResumeThemeInput = z.infer<typeof resumeThemeSchema>;

export const resumeSectionCreateSchema = z.object({
  slug: z.string().min(1),
  titleEn: z.string().optional(),
  titleFr: z.string().optional(),
  type: z.string().min(1),
  entryType: z.string().optional(),
  entryIds: z.array(z.string()).optional(),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const resumeSectionUpdateSchema = resumeSectionCreateSchema.partial();

export type ResumeSectionCreateInput = z.infer<typeof resumeSectionCreateSchema>;
export type ResumeSectionUpdateInput = z.infer<typeof resumeSectionUpdateSchema>;

