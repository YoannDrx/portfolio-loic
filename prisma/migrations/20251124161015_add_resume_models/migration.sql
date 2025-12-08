-- CreateTable
CREATE TABLE "resume_profile" (
    "id" TEXT NOT NULL DEFAULT 'default_profile',
    "name" TEXT NOT NULL,
    "roleEn" TEXT NOT NULL,
    "roleFr" TEXT NOT NULL,
    "headlineEn" TEXT,
    "headlineFr" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "website" TEXT,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resume_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_theme" (
    "id" TEXT NOT NULL DEFAULT 'default_theme',
    "primary" TEXT NOT NULL,
    "secondary" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "muted" TEXT NOT NULL,
    "sidebar" TEXT NOT NULL,
    "divider" TEXT NOT NULL,
    "gradientFrom" TEXT NOT NULL,
    "gradientTo" TEXT NOT NULL,
    "tagBg" TEXT NOT NULL,
    "tagText" TEXT NOT NULL,
    "fontHeadings" TEXT NOT NULL,
    "fontBody" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resume_theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_sections" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT,
    "titleFr" TEXT,
    "type" TEXT NOT NULL,
    "entryType" TEXT,
    "entryIds" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resume_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "resume_sections_slug_key" ON "resume_sections"("slug");

-- CreateIndex
CREATE INDEX "resume_sections_published_order_idx" ON "resume_sections"("published", "order");
