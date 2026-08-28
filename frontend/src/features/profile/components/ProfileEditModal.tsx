import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Save, X } from "lucide-react";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { PublicUser } from "@/features/auth/types/auth.types";
import { getApiErrorMessage } from "@/features/auth/utils/get-api-error-message";

import {
  profileFormSchema,
  type ProfileFormValues,
} from "../schemas/profile.schemas";
import { updateProfile } from "../services/profile.api";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: PublicUser;
}

const inputClassName =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-950 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-violet-500 dark:focus:bg-white/10 dark:focus:ring-violet-500/10";

const errorClassName =
  "mt-1 block text-xs font-semibold text-red-600 dark:text-red-300";

export const ProfileEditModal = ({
  isOpen,
  onClose,
  user,
}: ProfileEditModalProps) => {
  const { refreshUser } = useAuth();

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),

    defaultValues: {
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      city: user.city,
      gender: user.gender,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      city: user.city,
      gender: user.gender,
    });
  }, [isOpen, reset, user]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    try {
      await updateProfile(values);

      await refreshUser();

      onClose();
    } catch (error) {
      setError("root.server", {
        message: getApiErrorMessage(error),
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        aria-label="Close edit profile"
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        disabled={isSubmitting}
        onClick={onClose}
        type="button"
      />

      <section
        aria-labelledby="edit-profile-title"
        aria-modal="true"
        className="relative z-10 max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7 dark:border-white/10 dark:bg-[#0d182b]"
        role="dialog"
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2
              className="text-xl font-extrabold text-[#11175f] dark:text-white"
              id="edit-profile-title"
            >
              Edit Profile
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Update your personal account information.
            </p>
          </div>

          <button
            aria-label="Close modal"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-white/5 dark:hover:text-white"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </header>

        <form
          className="mt-6 grid gap-5 sm:grid-cols-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          {errors.root?.server?.message && (
            <p
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 sm:col-span-2 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
              role="alert"
            >
              {errors.root.server.message}
            </p>
          )}

          <label className="block">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Full Name
            </span>

            <input
              autoComplete="name"
              className={inputClassName}
              {...register("fullName")}
            />

            {errors.fullName && (
              <span className={errorClassName}>{errors.fullName.message}</span>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Username
            </span>

            <input
              autoComplete="username"
              className={inputClassName}
              {...register("username")}
            />

            {errors.username && (
              <span className={errorClassName}>{errors.username.message}</span>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Email
            </span>

            <input
              autoComplete="email"
              className={inputClassName}
              type="email"
              {...register("email")}
            />

            {errors.email && (
              <span className={errorClassName}>{errors.email.message}</span>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Phone Number
            </span>

            <input
              autoComplete="tel"
              className={inputClassName}
              type="tel"
              {...register("phoneNumber")}
            />

            {errors.phoneNumber && (
              <span className={errorClassName}>
                {errors.phoneNumber.message}
              </span>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              City
            </span>

            <input
              autoComplete="address-level2"
              className={inputClassName}
              {...register("city")}
            />

            {errors.city && (
              <span className={errorClassName}>{errors.city.message}</span>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Gender
            </span>

            <select className={inputClassName} {...register("gender")}>
              <option value="MALE">Male</option>

              <option value="FEMALE">Female</option>

              <option value="OTHER">Other</option>

              <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
            </select>

            {errors.gender && (
              <span className={errorClassName}>{errors.gender.message}</span>
            )}
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:col-span-2 sm:flex-row sm:justify-end dark:border-white/5">
            <button
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5"
              disabled={isSubmitting}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>

            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <LoaderCircle className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}

              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
