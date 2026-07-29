/*
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