-- AlterTable
ALTER TABLE "public"."event" ADD COLUMN     "attendeeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxAttendeeCount" INTEGER;
