/*
  Warnings:

  - The values [PENDING_CONFIRMATION,EXPIRED,CHECKED_IN,COMPLETED,NO_SHOW] on the enum `ReservationStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `cafe_id` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the `cafes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reservation_histories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `visits` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reservation_at` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- drop table
DROP TABLE "reservation_histories";

-- AlterEnum
BEGIN;
CREATE TYPE "ReservationStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');
ALTER TABLE "public"."reservations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "reservations" ALTER COLUMN "status" TYPE "ReservationStatus_new" USING ("status"::text::"ReservationStatus_new");
ALTER TYPE "ReservationStatus" RENAME TO "ReservationStatus_old";
ALTER TYPE "ReservationStatus_new" RENAME TO "ReservationStatus";
DROP TYPE "public"."ReservationStatus_old";
ALTER TABLE "reservations" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
-- ALTER TABLE "reservation_histories" DROP CONSTRAINT "reservation_histories_reservation_id_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_cafe_id_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_cafe_id_fkey";

-- DropForeignKey
ALTER TABLE "visits" DROP CONSTRAINT "visits_reservation_cafe_id_fkey";

-- DropIndex
DROP INDEX "reservations_cafe_id_idx";

-- DropIndex
DROP INDEX "reservations_customer_id_key";

-- DropIndex
DROP INDEX "reservations_id_cafe_id_key";

-- DropIndex
DROP INDEX "reservations_status_start_time_expires_at_idx";

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "cafe_id",
DROP COLUMN "customer_id",
DROP COLUMN "end_time",
DROP COLUMN "expires_at",
DROP COLUMN "start_time",
ADD COLUMN     "name" VARCHAR(150) NOT NULL,
ADD COLUMN     "phone" VARCHAR(30) NOT NULL,
ADD COLUMN     "reservation_at" TIMESTAMPTZ(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- DropTable
DROP TABLE "cafes";

-- DropTable
DROP TABLE "customers";

-- DropTable
-- DROP TABLE "reservation_histories";

-- DropTable
DROP TABLE "visits";

-- CreateIndex
CREATE INDEX "reservations_status_reservation_at_idx" ON "reservations"("status", "reservation_at");
