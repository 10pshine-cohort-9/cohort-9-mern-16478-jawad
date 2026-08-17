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
          reject(
            new AppError("Failed to upload profile image", 500, {
              code: "CLOUDINARY_UPLOAD_FAILED",
              cause: error,
            }),
          );
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
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new AppError(
        `Unexpected Cloudinary deletion result: ${result.result}`,
        502,
        {
          code: "PROFILE_IMAGE_DELETE_FAILED",
          details: {
            publicId,
            result: result.result,
          },
        },
      );
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Profile image could not be deleted", 502, {
      code: "PROFILE_IMAGE_DELETE_FAILED",
      cause: error,
    });
  }
};
