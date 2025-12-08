-- CreateTable
CREATE TABLE "resume_entries" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleFr" TEXT NOT NULL,
    "subtitleEn" TEXT,
    "subtitleFr" TEXT,
    "dateRangeEn" TEXT,
    "dateRangeFr" TEXT,
    "descriptionEn" TEXT,
    "descriptionFr" TEXT,
    "value" INTEGER,
    "link" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "resume_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resume_entries_type_order_idx" ON "resume_entries"("type", "order");

-- AddForeignKey
ALTER TABLE "resume_entries" ADD CONSTRAINT "resume_entries_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
