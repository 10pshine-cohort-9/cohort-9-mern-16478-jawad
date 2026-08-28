import { Camera } from "lucide-react";
import { useState } from "react";

import { ProfileImageManagerModal } from "./ProfileImageManagerModal";

interface ProfileImagePickerProps {
  fullName: string;
  imageUrl: string | null;
}

const getInitials = (fullName: string): string => {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const ProfileImagePicker = ({
  fullName,
  imageUrl,
}: ProfileImagePickerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center">
        <div className="relative">
          {imageUrl ? (
            <img
              alt={`${fullName} profile`}
              className="size-40 rounded-full border-4 border-white object-cover shadow-[0_15px_40px_rgba(79,70,229,0.18)] ring-2 ring-violet-100 sm:size-44 dark:border-[#0d182b] dark:ring-violet-500/20"
              src={imageUrl}
            />
          ) : (
            <span className="flex size-40 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-violet-600 to-indigo-700 text-4xl font-extrabold text-white shadow-[0_15px_40px_rgba(79,70,229,0.18)] ring-2 ring-violet-100 sm:size-44 dark:border-[#0d182b] dark:ring-violet-500/20">
              {getInitials(fullName)}
            </span>
          )}

          <button
            aria-label="Manage profile photo"
            className="absolute bottom-2 right-1 flex size-11 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg transition hover:scale-105 dark:border-[#0d182b]"
            onClick={() => {
              setIsModalOpen(true);
            }}
            title="Manage profile photo"
            type="button"
          >
            <Camera size={18} />
          </button>
        </div>

        <button
          className="mt-4 text-xs font-bold text-violet-600 transition hover:text-violet-800 dark:text-violet-300"
          onClick={() => {
            setIsModalOpen(true);
          }}
          type="button"
        >
          Manage profile photo
        </button>
      </div>

      <ProfileImageManagerModal
        fullName={fullName}
        imageUrl={imageUrl}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
};
