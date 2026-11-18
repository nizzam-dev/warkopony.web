DO $$
BEGIN
  IF (EXISTS (SELECT 1 FROM "reservations") OR EXISTS (SELECT 1 FROM "visits"))
     AND (SELECT COUNT(*) FROM "cafes") <> 1 THEN
    RAISE EXCEPTION 'Cannot safely associate existing reservations or visits: provide an explicit cafe mapping before applying this migration';
  END IF;
END $$;

ALTER TABLE "reservations" ADD COLUMN "cafe_id" UUID;
ALTER TABLE "visits" ADD COLUMN "cafe_id" UUID;

-- Existing rows did not record a cafe. At this point the guard guarantees one
-- cafe for non-empty occupancy data, so this mapping is unambiguous.
UPDATE "reservations"
SET "cafe_id" = (SELECT "id" FROM "cafes" ORDER BY "id" LIMIT 1)
WHERE "cafe_id" IS NULL;

UPDATE "visits"
SET "cafe_id" = COALESCE(
  (SELECT "cafe_id" FROM "reservations" WHERE "reservations"."id" = "visits"."reservation_id"),
  (SELECT "id" FROM "cafes" ORDER BY "id" LIMIT 1)
)
WHERE "cafe_id" IS NULL;

ALTER TABLE "reservations" ALTER COLUMN "cafe_id" SET NOT NULL;
ALTER TABLE "visits" ALTER COLUMN "cafe_id" SET NOT NULL;

CREATE INDEX "reservations_cafe_id_idx" ON "reservations"("cafe_id");
CREATE INDEX "visits_cafe_id_idx" ON "visits"("cafe_id");
CREATE UNIQUE INDEX "reservations_id_cafe_id_key" ON "reservations"("id", "cafe_id");
CREATE UNIQUE INDEX "visits_reservation_id_cafe_id_key" ON "visits"("reservation_id", "cafe_id");

ALTER TABLE "reservations"
ADD CONSTRAINT "reservations_cafe_id_fkey"
FOREIGN KEY ("cafe_id") REFERENCES "cafes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "visits"
ADD CONSTRAINT "visits_cafe_id_fkey"
FOREIGN KEY ("cafe_id") REFERENCES "cafes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "visits" DROP CONSTRAINT "visits_reservation_id_fkey";
ALTER TABLE "visits"
ADD CONSTRAINT "visits_reservation_cafe_id_fkey"
FOREIGN KEY ("reservation_id", "cafe_id") REFERENCES "reservations"("id", "cafe_id") ON DELETE RESTRICT ON UPDATE CASCADE;
