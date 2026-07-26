-- CreateEnum
CREATE TYPE "NoteActivityType" AS ENUM ('CREATED', 'UPDATED', 'PINNED', 'UNPINNED', 'FAVORITED', 'UNFAVORITED', 'TRASHED', 'RESTORED', 'PERMANENTLY_DELETED');

-- CreateTable
CREATE TABLE "note_activities" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "note_id" UUID,
    "type" "NoteActivityType" NOT NULL,
    "note_title" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "note_activities_user_id_created_at_idx" ON "note_activities"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "note_activities_note_id_idx" ON "note_activities"("note_id");

-- AddForeignKey
ALTER TABLE "note_activities" ADD CONSTRAINT "note_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_activities" ADD CONSTRAINT "note_activities_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
