import { AppError } from "../errors/app-error.js";
import { cloudinary } from "../../lib/cloudinary.js";
import type { UploadedProfileImage } from "../../modules/auth/auth.types.js";

<<<<<<< HEAD
const CLOUDINARY_UPLOAD_TIMEOUT_MS = 15_000;

=======
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
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
<<<<<<< HEAD
        timeout: CLOUDINARY_UPLOAD_TIMEOUT_MS,

=======
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
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
<<<<<<< HEAD
          reject(
            new AppError("Profile image upload failed", 502, {
              code: "PROFILE_IMAGE_UPLOAD_FAILED",
              cause: error,
            }),
          );

=======
          reject(error);
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
          return;
        }

        if (!result) {
          reject(
            new AppError("Cloudinary returned an empty upload result", 502, {
              code: "PROFILE_IMAGE_UPLOAD_FAILED",
            }),
          );
<<<<<<< HEAD

=======
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
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
<<<<<<< HEAD
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });

    if (result.result !== "ok") {
      throw new AppError(
        `Cloudinary could not delete profile image: ${result.result}`,
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
=======
  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
>>>>>>> 7ea15c4 (feat(backend): implement complete authentication API)
};
