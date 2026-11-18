-- Backfill the new check-in deadline while retaining the legacy end_time column
-- so applying this migration does not discard existing timestamp data.
-- DropIndex
DROP INDEX "reservations_status_start_time_end_time_idx";

-- AlterTable
ALTER TABLE "reservations"
ADD COLUMN "expires_at" TIMESTAMPTZ(3);

UPDATE "reservations"
SET "expires_at" = "start_time" + INTERVAL '30 minutes'
WHERE "expires_at" IS NULL;

ALTER TABLE "reservations" ALTER COLUMN "expires_at" SET NOT NULL;

COMMENT ON COLUMN "reservations"."end_time" IS 'Legacy reservation end timestamp retained during expires_at migration.';

-- CreateIndex
CREATE INDEX "reservations_status_start_time_expires_at_idx" ON "reservations"("status", "start_time", "expires_at");
