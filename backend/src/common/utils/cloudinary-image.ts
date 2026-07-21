import { AppError } from "../errors/app-error.js";
import { cloudinary } from "../../lib/cloudinary.js";
import type { UploadedProfileImage } from "../../modules/auth/auth.types.js";

export const uploadProfileImage = async (
  file: Express.Multer.File,
): Promise<UploadedProfileImage> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "notes-app/profile-images",
        resource_type: "image",
        unique_filename: true,
        overwrite: false,
        transformation: [
          {
            width: 512,
            height: 512,
            crop: "fill",
            gravity: "face",
          },
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(
            new AppError("Cloudinary returned an empty upload result", 502, {
              code: "PROFILE_IMAGE_UPLOAD_FAILED",
            }),
          );
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(file.buffer);
  });
};

export const deleteProfileImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
};
