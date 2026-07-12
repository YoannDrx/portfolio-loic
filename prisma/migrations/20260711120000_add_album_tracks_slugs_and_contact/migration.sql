-- Additive content and contact migration. Existing ID routes remain valid.
ALTER TABLE "albums"
  ADD COLUMN "slug" TEXT,
  ADD COLUMN "releaseDate" TIMESTAMP(3),
  ADD COLUMN "releaseType" TEXT,
  ADD COLUMN "label" TEXT,
  ADD COLUMN "publisher" TEXT,
  ADD COLUMN "roleFr" TEXT,
  ADD COLUMN "roleEn" TEXT,
  ADD COLUMN "creditsFr" TEXT,
  ADD COLUMN "creditsEn" TEXT,
  ADD COLUMN "tracklistSourceUrl" TEXT,
  ADD COLUMN "tracklistVerifiedAt" TIMESTAMP(3);

ALTER TABLE "services" ADD COLUMN "slug" TEXT;

CREATE UNIQUE INDEX "albums_slug_key" ON "albums"("slug");
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

CREATE TABLE "album_tracks" (
  "id" TEXT NOT NULL,
  "albumId" TEXT NOT NULL,
  "position" INTEGER NOT NULL,
  "discNumber" INTEGER NOT NULL DEFAULT 1,
  "title" TEXT NOT NULL,
  "artists" TEXT,
  "durationSeconds" INTEGER,
  "explicit" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "album_tracks_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "album_tracks_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "album_tracks_albumId_discNumber_position_key" ON "album_tracks"("albumId", "discNumber", "position");
CREATE INDEX "album_tracks_albumId_discNumber_position_idx" ON "album_tracks"("albumId", "discNumber", "position");

CREATE TABLE "contact_messages" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "company" TEXT,
  "projectType" TEXT NOT NULL,
  "projectFormat" TEXT,
  "deadline" TEXT,
  "budget" TEXT,
  "references" TEXT,
  "subject" TEXT,
  "message" TEXT NOT NULL,
  "locale" TEXT NOT NULL DEFAULT 'fr',
  "status" TEXT NOT NULL DEFAULT 'new',
  "emailStatus" TEXT NOT NULL DEFAULT 'pending',
  "emailError" TEXT,
  "rateLimitKey" TEXT NOT NULL,
  "processedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "contact_messages_status_createdAt_idx" ON "contact_messages"("status", "createdAt" DESC);
CREATE INDEX "contact_messages_rateLimitKey_createdAt_idx" ON "contact_messages"("rateLimitKey", "createdAt" DESC);
CREATE INDEX "contact_messages_expiresAt_idx" ON "contact_messages"("expiresAt");
