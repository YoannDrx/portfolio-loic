-- Versions table
CREATE TABLE "cv_version" (
    "id" TEXT NOT NULL,
    "cvId" TEXT,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_version_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "cv_version_cvId_createdAt_idx" ON "cv_version"("cvId", "createdAt");

ALTER TABLE "cv_version" ADD CONSTRAINT "cv_version_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE CASCADE ON UPDATE CASCADE;
