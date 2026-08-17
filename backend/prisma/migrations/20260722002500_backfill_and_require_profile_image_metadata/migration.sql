/*
  Backfill Cloudinary public IDs for existing users before
  enforcing the required profile-image constraints.
*/

UPDATE "users"
SET "profile_image_public_id" = regexp_replace(
  regexp_replace(
    split_part("profile_image_url", '/upload/', 2),
    '^v[0-9]+/',
    ''
  ),
  E'\\.[A-Za-z0-9]+$',
  ''
)
WHERE "profile_image_public_id" IS NULL
  AND "profile_image_url" IS NOT NULL
  AND "profile_image_url"
    LIKE 'https://res.cloudinary.com/%/image/upload/%';

/*
  Stop the migration with an explicit error if any existing user
  still does not have valid profile-image metadata.
*/
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "users"
    WHERE "profile_image_url" IS NULL
       OR "profile_image_public_id" IS NULL
  ) THEN
    RAISE EXCEPTION
      'Cannot enforce required profile image metadata: existing users need valid profile-image data';
  END IF;
END
$$;


ALTER TABLE "users" 
  ADD CONSTRAINT "profile_image_url_not_null" 
  CHECK ("profile_image_url" IS NOT NULL) NOT VALID;

ALTER TABLE "users" 
  ADD CONSTRAINT "profile_image_public_id_not_null" 
  CHECK ("profile_image_public_id" IS NOT NULL) NOT VALID;


ALTER TABLE "users" VALIDATE CONSTRAINT "profile_image_url_not_null";
ALTER TABLE "users" VALIDATE CONSTRAINT "profile_image_public_id_not_null";


ALTER TABLE "users"
  ALTER COLUMN "profile_image_url" SET NOT NULL,
  ALTER COLUMN "profile_image_public_id" SET NOT NULL;