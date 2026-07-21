/*
  Warnings:

  - Added the required column `profile_image_public_id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `profile_image_url` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "profile_image_public_id" VARCHAR(255) NOT NULL,
ALTER COLUMN "profile_image_url" SET NOT NULL;
