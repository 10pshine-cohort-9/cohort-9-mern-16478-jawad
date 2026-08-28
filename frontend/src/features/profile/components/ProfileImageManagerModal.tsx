import {
  Camera,
  ImageOff,
  LoaderCircle,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useState } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/features/auth/utils/get-api-error-message";

import {
  deleteProfileImage,
  updateProfileImage,
} from "../services/profile.api";

interface ProfileImageManagerModalProps {
  fullName: string;
  imageUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const getInitials = (fullName: string): string => {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const ProfileImageManagerModal = ({
  fullName,
  imageUrl,
  isOpen,
  onClose,
}: ProfileImageManagerModalProps) => {
  const fileInputId = useId();

  const { refreshUser } = useAuth();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>();

  const isBusy = isUploading || isDeleting;

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(null);
    setPreviewUrl(null);
    setErrorMessage(undefined);
  };

  const completeAndClose = () => {
    resetSelection();
    onClose();
  };

  const handleClose = () => {
    if (isBusy) {
      return;
    }

    completeAndClose();
  };

  const handleImageSelection = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Only JPG, PNG and WEBP images are allowed.");

      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setErrorMessage("Profile image cannot exceed 5 MB.");

      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(file);

    setPreviewUrl(URL.createObjectURL(file));

    setErrorMessage(undefined);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      return;
    }

    setIsUploading(true);
    setErrorMessage(undefined);

    try {
      await updateProfileImage(selectedImage);

      await refreshUser();

      completeAndClose();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageUrl) {
      return;
    }

    const confirmed = window.confirm("Remove your current profile photo?");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(undefined);

    try {
      await deleteProfileImage();

      await refreshUser();

      completeAndClose();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const displayedImageUrl = previewUrl ?? imageUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{
            opacity: 1,
          }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          exit={{
            opacity: 0,
          }}
          initial={{
            opacity: 0,
          }}
        >
          <button
            aria-label="Close photo manager"
            className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
            disabled={isBusy}
            onClick={handleClose}
            type="button"
          />

          <motion.section
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            aria-labelledby="profile-photo-title"
            aria-modal="true"
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0d182b]"
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 10,
            }}
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 10,
            }}
            role="dialog"
            transition={{
              duration: 0.2,
            }}
          >
            <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5 dark:border-white/5">
              <div>
                <h2
                  className="text-xl font-extrabold text-[#11175f] dark:text-white"
                  id="profile-photo-title"
                >
                  Manage Profile Photo
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Preview, replace or remove your photo.
                </p>
              </div>

              <button
                aria-label="Close modal"
                className="flex size-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-white/5 dark:hover:text-white"
                disabled={isBusy}
                onClick={handleClose}
                type="button"
              >
                <X size={20} />
              </button>
            </header>

            <div className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-6 py-8 dark:from-violet-500/10 dark:via-[#0d182b] dark:to-indigo-500/10">
              <div className="flex flex-col items-center">
                <div className="relative">
                  {displayedImageUrl ? (
                    <img
                      alt={`${fullName} profile preview`}
                      className="size-44 rounded-full border-4 border-white object-cover shadow-[0_18px_50px_rgba(79,70,229,0.22)] ring-2 ring-violet-200 dark:border-[#0d182b] dark:ring-violet-500/30"
                      src={displayedImageUrl}
                    />
                  ) : (
                    <span className="flex size-44 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-violet-600 to-indigo-700 text-5xl font-extrabold text-white shadow-[0_18px_50px_rgba(79,70,229,0.22)] ring-2 ring-violet-200 dark:border-[#0d182b] dark:ring-violet-500/30">
                      {getInitials(fullName)}
                    </span>
                  )}

                  <span className="absolute bottom-2 right-2 flex size-11 items-center justify-center rounded-full border-4 border-white bg-violet-600 text-white shadow-lg dark:border-[#0d182b]">
                    <Camera size={18} />
                  </span>
                </div>

                {selectedImage && (
                  <div className="mt-5 rounded-xl border border-violet-200 bg-white/80 px-4 py-2 text-center dark:border-violet-500/20 dark:bg-white/5">
                    <p className="max-w-72 truncate text-xs font-bold text-violet-700 dark:text-violet-300">
                      {selectedImage.name}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      New photo preview
                    </p>
                  </div>
                )}
              </div>
            </div>

            {errorMessage && (
              <p
                className="mx-6 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            <div className="grid gap-3 px-6 py-6 sm:grid-cols-2">
              <label
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 text-sm font-bold text-violet-700 transition hover:bg-violet-100 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300"
                htmlFor={fileInputId}
              >
                <Upload size={18} />
                Choose New Photo
                <input
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={isBusy}
                  id={fileInputId}
                  onChange={(event) => {
                    handleImageSelection(event.target.files?.[0]);

                    event.target.value = "";
                  }}
                  type="file"
                />
              </label>

              <button
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10"
                disabled={isBusy || !imageUrl || selectedImage !== null}
                onClick={() => {
                  void handleDelete();
                }}
                type="button"
              >
                {isDeleting ? (
                  <LoaderCircle className="animate-spin" size={18} />
                ) : (
                  <Trash2 size={18} />
                )}

                {isDeleting ? "Deleting..." : "Delete Photo"}
              </button>

              {selectedImage && (
                <>
                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
                    disabled={isBusy}
                    onClick={resetSelection}
                    type="button"
                  >
                    <ImageOff size={18} />
                    Cancel Preview
                  </button>

                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 disabled:opacity-60"
                    disabled={isBusy}
                    onClick={() => {
                      void handleUpload();
                    }}
                    type="button"
                  >
                    {isUploading ? (
                      <LoaderCircle className="animate-spin" size={18} />
                    ) : (
                      <Save size={18} />
                    )}

                    {isUploading ? "Uploading..." : "Save Photo"}
                  </button>
                </>
              )}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
