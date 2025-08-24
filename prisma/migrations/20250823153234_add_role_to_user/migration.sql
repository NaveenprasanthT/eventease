-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'STAFF', 'EVENT_OWNER');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "role" "public"."Role" DEFAULT 'STAFF';
