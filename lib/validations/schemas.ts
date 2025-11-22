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
  collabName: z.string().optional(),
  collabLink: z.union([urlSchema, z.literal("")]).optional(),
  descriptionsFr: htmlContentSchema,
  descriptionsEn: htmlContentSchema,
  published: z.boolean().default(false),
  order: z.number().int().min(0).default(0),
});

export const albumUpdateSchema = albumCreateSchema.partial();

export type AlbumCreateInput = z.infer<typeof albumCreateSchema>;
export type AlbumUpdateInput = z.infer<typeof albumUpdateSchema>;

// ============================================
// VIDEO SCHEMAS
// ============================================

const videoTypes = ["OriginalMusic", "Sync", "MusicToPicture"] as const;

export const videoCreateSchema = z.object({
  img: urlSchema,
  type: z.enum(videoTypes, {
    errorMap: () => ({ message: "Type de vidéo invalide" }),
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
  sortBy: z.enum(["date", "title", "order", "createdAt"]).default("sortedDate"),
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
