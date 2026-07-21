/*
<<<<<<< HEAD
  Add the new profile-image metadata safely for databases
  that may already contain users.
*/

-- Step 1: Add the new column as nullable.
ALTER TABLE "users"
ADD COLUMN "profile_image_public_id" VARCHAR(255);

-- Step 2: Backfill legacy users before adding constraints.
UPDATE "users"
SET
  "profile_image_url" = COALESCE(
    "profile_image_url",
    'https://placehold.co/512x512/png?text=User'
  ),
  "profile_image_public_id" = COALESCE(
    "profile_image_public_id",
    'legacy/' || "id"::text
  );

-- Step 3: Enforce the required constraints for all rows.
ALTER TABLE "users"
ALTER COLUMN "profile_image_public_id" SET NOT NULL,
ALTER COLUMN "profile_image_url" SET NOT NULL;
=======
  Warnings:

  - Added the required column `profile_image_public_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `profile_image_url` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profile_image_public_id" VARCHAR(255) NOT NULL,
ALTER COLUMN "profile_image_url" SET NOT NULL;
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
