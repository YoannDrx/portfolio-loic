-- CreateTable
CREATE TABLE "content_versions" (
    "id" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "changes" JSONB,
    "action" TEXT NOT NULL DEFAULT 'update',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "content_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "content_versions_contentType_contentId_createdAt_idx" ON "content_versions"("contentType", "contentId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "content_versions_createdAt_idx" ON "content_versions"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "content_versions_contentType_contentId_version_key" ON "content_versions"("contentType", "contentId", "version");

-- AddForeignKey
ALTER TABLE "content_versions" ADD CONSTRAINT "content_versions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
