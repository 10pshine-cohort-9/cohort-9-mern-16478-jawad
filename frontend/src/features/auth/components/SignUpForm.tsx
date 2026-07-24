import { zodResolver } from "@hookform/resolvers/zod";
import {
  AtSign,
  Check,
  Mail,
  MapPin,
  Phone,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";

import {
  AuthField,
  authInputClassName,
} from "@/features/auth/components/AuthField";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { registerUser as registerAccount } from "@/features/auth/services/auth.api";
import type { Gender } from "@/features/auth/types/auth.types";
import { getApiErrorMessage } from "@/features/auth/utils/get-api-error-message";
import { cn } from "@/lib/cn";

interface SignUpFormProps {
  onShowSignIn: () => void;
}

const genders: Array<{
  label: string;
  value: Gender;
}> = [
  {
    label: "Male",
    value: "MALE",
  },
  {
    label: "Female",
    value: "FEMALE",
  },
  {
    label: "Other",
    value: "OTHER",
  },
  {
    label: "Prefer not to say",
    value: "PREFER_NOT_TO_SAY",
  },
];

const compactInputClassName = "pl-11 [@media(max-height:760px)]:h-10";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

export const SignUpForm = ({ onShowSignIn }: SignUpFormProps) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [photoName, setPhotoName] = useState<string>();

  const [photoPreview, setPhotoPreview] = useState<string>();

  const [successMessage, setSuccessMessage] = useState<string>();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      gender: "MALE",
      city: "",
    },
  });

  const selectedGender = watch("gender");

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    clearErrors("profileImage");

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("profileImage", {
        type: "validate",
        message: "Select a PNG, JPG or WEBP image.",
      });

      event.target.value = "";

      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setError("profileImage", {
        type: "validate",
        message: "Profile image cannot exceed 5 MB.",
      });

      event.target.value = "";

      return;
    }

    setValue("profileImage", file, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    setPhotoName(file.name);

    setPhotoPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: RegisterFormValues) => {
    clearErrors();

    setSuccessMessage(undefined);

    if (!acceptedTerms) {
      setError("root.terms", {
        type: "manual",
        message: "You must accept the Terms of Service and Privacy Policy.",
      });

      return;
    }

    try {
      const response = await registerAccount({
        fullName: values.fullName.trim().replace(/\s+/g, " "),

        username: values.username.trim().toLowerCase(),

        email: values.email.trim().toLowerCase(),

        phoneNumber: values.phoneNumber.replace(/[\s()-]/g, ""),

        password: values.password,

        confirmPassword: values.confirmPassword,

        gender: values.gender,

        city: values.city.trim(),

        profileImage: values.profileImage,
      });

      setSuccessMessage(response.message);

      reset();

      setAcceptedTerms(false);
      setPhotoName(undefined);
      setPhotoPreview(undefined);

      window.setTimeout(() => {
        onShowSignIn();
      }, 1_200);
    } catch (error) {
      setError("root.server", {
        type: "server",
        message: getApiErrorMessage(error),
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[610px]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[#17143d] [@media(max-height:760px)]:text-[1.7rem]">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-slate-500 [@media(max-height:760px)]:mt-1 [@media(max-height:760px)]:text-[13px]">
          Fill in the details below to get started.
        </p>
      </header>

      <form
        className="mt-6 space-y-4 [@media(max-height:760px)]:mt-4 [@media(max-height:760px)]:space-y-2.5"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 [@media(max-height:760px)]:gap-y-2.5">
          {/* Full name */}
          <AuthField
            error={errors.fullName?.message}
            htmlFor="fullName"
            label="Full Name"
            required
          >
            <div className="relative">
              <UserRound
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />

              <input
                {...register("fullName")}
                aria-invalid={Boolean(errors.fullName)}
                autoComplete="name"
                className={cn(authInputClassName, compactInputClassName)}
                id="fullName"
                placeholder="Enter your full name"
                type="text"
              />
            </div>
          </AuthField>

          {/* Username */}
          <AuthField
            error={errors.username?.message}
            htmlFor="username"
            label="Username"
            required
          >
            <div className="relative">
              <AtSign
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />

              <input
                {...register("username", {
                  setValueAs: (value: unknown) =>
                    String(value).trim().toLowerCase(),
                })}
                aria-invalid={Boolean(errors.username)}
                autoComplete="username"
                className={cn(authInputClassName, compactInputClassName)}
                id="username"
                placeholder="Choose a username"
                type="text"
              />
            </div>
          </AuthField>

          {/* Email */}
          <AuthField
            error={errors.email?.message}
            htmlFor="email"
            label="Email Address"
            required
          >
            <div className="relative">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />

              <input
                {...register("email", {
                  setValueAs: (value: unknown) =>
                    String(value).trim().toLowerCase(),
                })}
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                className={cn(authInputClassName, compactInputClassName)}
                id="email"
                placeholder="Enter your email"
                type="email"
              />
            </div>
          </AuthField>

          {/* Phone */}
          <AuthField
            error={errors.phoneNumber?.message}
            htmlFor="phoneNumber"
            label="Phone Number"
            required
          >
            <div className="relative">
              <Phone
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />

              <input
                {...register("phoneNumber", {
                  setValueAs: (value: unknown) =>
                    String(value).replace(/[\s()-]/g, ""),
                })}
                aria-invalid={Boolean(errors.phoneNumber)}
                autoComplete="tel"
                className={cn(authInputClassName, compactInputClassName)}
                id="phoneNumber"
                placeholder="+923001234567"
                type="tel"
              />
            </div>
          </AuthField>

          {/* Password */}
          <PasswordInput
            {...register("password")}
            autoComplete="new-password"
            className="[@media(max-height:760px)]:h-10"
            error={errors.password?.message}
            id="signupPassword"
            label="Password"
            placeholder="Create a password"
            required
          />

          {/* Confirm password */}
          <PasswordInput
            {...register("confirmPassword")}
            autoComplete="new-password"
            className="[@media(max-height:760px)]:h-10"
            error={errors.confirmPassword?.message}
            id="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            required
          />

          {/* Gender */}
          <fieldset>
            <legend className="mb-2 text-[13px] font-semibold text-slate-800 [@media(max-height:760px)]:mb-1.5 [@media(max-height:760px)]:text-xs">
              Gender
            </legend>

            <div className="flex min-h-12 flex-wrap items-center gap-x-4 gap-y-2 [@media(max-height:760px)]:min-h-10">
              {genders.map(({ label, value }) => (
                <label
                  className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 [@media(max-height:760px)]:text-xs"
                  key={value}
                >
                  <input
                    {...register("gender")}
                    className="sr-only"
                    type="radio"
                    value={value}
                  />

                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border transition",
                      selectedGender === value
                        ? "border-violet-600 ring-4 ring-violet-100"
                        : "border-slate-300",
                    )}
                  >
                    {selectedGender === value && (
                      <span className="size-2.5 rounded-full bg-violet-600" />
                    )}
                  </span>

                  {label}
                </label>
              ))}
            </div>

            {errors.gender?.message && (
              <p className="mt-1.5 text-xs font-medium text-red-600">
                {errors.gender.message}
              </p>
            )}
          </fieldset>

          {/* City */}
          <AuthField
            error={errors.city?.message}
            htmlFor="city"
            label="City"
            required
          >
            <div className="relative">
              <MapPin
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />

              <input
                {...register("city")}
                aria-invalid={Boolean(errors.city)}
                autoComplete="address-level2"
                className={cn(authInputClassName, compactInputClassName)}
                id="city"
                placeholder="Enter your city"
                type="text"
              />
            </div>
          </AuthField>
        </div>

        {/* Profile photo */}
        <div>
          <label
            className="mb-2 block text-[13px] font-semibold text-slate-800 [@media(max-height:760px)]:mb-1.5 [@media(max-height:760px)]:text-xs"
            htmlFor="profilePhoto"
          >
            Profile Photo (Required)
          </label>

          <label
            className="group flex min-h-20 cursor-pointer items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 transition hover:border-violet-400 hover:bg-violet-50/40 [@media(max-height:760px)]:min-h-16 [@media(max-height:760px)]:py-2"
            htmlFor="profilePhoto"
          >
            {photoPreview ? (
              <img
                alt="Selected profile"
                className="size-12 rounded-xl object-cover shadow-sm ring-2 ring-white [@media(max-height:760px)]:size-10"
                src={photoPreview}
              />
            ) : (
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-violet-600 shadow-sm ring-1 ring-slate-200 [@media(max-height:760px)]:size-10">
                <UploadCloud size={21} />
              </span>
            )}

            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-slate-800 group-hover:text-violet-700">
                {photoName ?? "Upload your photo"}
              </span>

              <span className="mt-0.5 block text-xs text-slate-500">
                PNG, JPG or WEBP up to 5MB
              </span>
            </span>

            <input
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              id="profilePhoto"
              onChange={handlePhotoChange}
              type="file"
            />
          </label>

          {errors.profileImage?.message && (
            <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
              {errors.profileImage.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600 [@media(max-height:760px)]:text-xs">
          <input
            checked={acceptedTerms}
            className="peer sr-only"
            onChange={(event) => {
              setAcceptedTerms(event.target.checked);

              if (event.target.checked) {
                clearErrors("root.terms");
              }
            }}
            type="checkbox"
          />

          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-slate-300 bg-white text-white transition peer-checked:border-violet-600 peer-checked:bg-violet-600 peer-focus-visible:ring-4 peer-focus-visible:ring-violet-100">
            <Check size={14} strokeWidth={3} />
          </span>

          <span>
            I agree to the{" "}
            <button
              className="font-medium text-violet-600 hover:text-violet-800"
              type="button"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              className="font-medium text-violet-600 hover:text-violet-800"
              type="button"
            >
              Privacy Policy
            </button>
          </span>
        </label>

        {errors.root?.terms?.message && (
          <p className="text-sm font-medium text-red-600" role="alert">
            {errors.root.terms.message}
          </p>
        )}

        {errors.root?.server?.message && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
            role="alert"
          >
            {errors.root.server.message}
          </div>
        )}

        {successMessage && (
          <div
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
            role="status"
          >
            {successMessage}
          </div>
        )}

        {/* Submit */}
        <button
          className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60 [@media(max-height:760px)]:h-10"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-slate-500 [@media(max-height:760px)]:text-xs">
          Already have an account?{" "}
          <button
            className="font-semibold text-violet-600 transition hover:text-violet-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100"
            onClick={onShowSignIn}
            type="button"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
};
