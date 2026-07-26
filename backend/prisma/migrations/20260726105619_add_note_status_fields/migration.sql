-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "deleted_at" TIMESTAMPTZ(3),
ADD COLUMN     "is_favorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_pinned" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "notes_user_id_deleted_at_updated_at_idx" ON "notes"("user_id", "deleted_at", "updated_at");

-- CreateIndex
CREATE INDEX "notes_user_id_is_pinned_deleted_at_idx" ON "notes"("user_id", "is_pinned", "deleted_at");

-- CreateIndex
CREATE INDEX "notes_user_id_is_favorite_deleted_at_idx" ON "notes"("user_id", "is_favorite", "deleted_at");
