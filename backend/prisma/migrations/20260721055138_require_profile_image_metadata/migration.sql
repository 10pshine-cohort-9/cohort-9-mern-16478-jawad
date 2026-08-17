/*
  Add the Cloudinary public ID as nullable first.

  Existing user records may already be present, so adding the
  column as NOT NULL immediately would make the migration fail.
*/

ALTER TABLE "users"
ADD COLUMN "profile_image_public_id" VARCHAR(255);
