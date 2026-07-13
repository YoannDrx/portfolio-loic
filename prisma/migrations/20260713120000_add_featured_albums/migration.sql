-- Add an explicit editorial selection without changing chronological catalogue sorting.
ALTER TABLE "albums"
  ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "featuredOrder" INTEGER;

-- Initial client selection. Slug matching is preferred, with title as a safe fallback.
UPDATE "albums"
SET "featured" = true,
    "featuredOrder" = CASE
      WHEN "slug" = 'terra' OR LOWER("title") = 'terra' THEN 0
      WHEN "slug" = 'cyberpunk' OR LOWER("title") = 'cyberpunk' THEN 1
      ELSE "featuredOrder"
    END
WHERE "slug" IN ('terra', 'cyberpunk')
   OR LOWER("title") IN ('terra', 'cyberpunk');

CREATE INDEX "albums_published_featured_featuredOrder_idx"
  ON "albums"("published", "featured", "featuredOrder");
