import {
  AtSign,
  Check,
  Mail,
  MapPin,
  Phone,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import {
  AuthField,
  authInputClassName,
} from "@/features/auth/components/AuthField";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { cn } from "@/lib/cn";

interface SignUpFormProps {
  onShowSignIn: () => void;
}

type Gender = "MALE" | "FEMALE" | "OTHER";

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
    label: "Prefer not to say",
    value: "OTHER",
  },
];

// const compactInputClassName = "pl-11 [@media(max-height:760px)]:h-10";
const compactInputClassName = "pl-11";

export const SignUpForm = ({ onShowSignIn }: SignUpFormProps) => {
  const [confirmPassword, setConfirmPassword] = useState("");

  const [gender, setGender] = useState<Gender>("MALE");

  const [password, setPassword] = useState("");

  const [passwordError, setPasswordError] = useState<string>();

  const [photoName, setPhotoName] = useState<string>();

  const [photoPreview, setPhotoPreview] = useState<string>();

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

    setPhotoPreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      return URL.createObjectURL(file);
    });

    setPhotoName(file.name);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");

      return;
    }

    setPasswordError(undefined);

    // Backend integration later phase mein hogi.
  };

  return (
    <div className="mx-auto w-full max-w-[575px]">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-[#17143d] [@media(max-height:760px)]:text-[1.7rem]">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-slate-500 [@media(max-height:760px)]:mt-1 [@media(max-height:760px)]:text-[13px]">
          Fill in the details below to get started.
        </p>
      </header>

      <form
        // className="mt-6 space-y-4 [@media(max-height:760px)]:mt-4 [@media(max-height:760px)]:space-y-2.5"
        className="mt-7 space-y-5"
        onSubmit={handleSubmit}
      >
        {/* <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2 [@media(max-height:760px)]:gap-y-2.5"> */}
        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          {/* Full name */}
          <AuthField htmlFor="fullName" label="Full Name" required>
            <div className="relative">
              <UserRound
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />

              <input
                autoComplete="name"
                className={cn(authInputClassName, compactInputClassName)}
                id="fullName"
                name="fullName"
                placeholder="Enter your full name"
                required
                type="text"
              />
            </div>
          </AuthField>

          {/* Username */}
          <AuthField htmlFor="username" label="Username" required>
            <div className="relative">
              <AtSign
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />

              <input
                autoComplete="username"
                className={cn(authInputClassName, compactInputClassName)}
                id="username"
                name="username"
                placeholder="Choose a username"
                required
                type="text"
              />
            </div>
          </AuthField>

          {/* Email */}
          <AuthField htmlFor="email" label="Email Address" required>
            <div className="relative">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />

              <input
                autoComplete="email"
                className={cn(authInputClassName, compactInputClassName)}
                id="email"
                name="email"
                placeholder="Enter your email"
                required
                type="email"
              />
            </div>
          </AuthField>

          {/* Phone */}
          <AuthField htmlFor="phoneNumber" label="Phone Number" required>
            <div className="relative">
              <Phone
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />

              <input
                autoComplete="tel"
                className={cn(authInputClassName, compactInputClassName)}
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter your phone number"
                required
                type="tel"
              />
            </div>
          </AuthField>

          {/* Password */}
          <PasswordInput
            autoComplete="new-password"
            // className="[@media(max-height:760px)]:h-10"
            error={passwordError}
            id="signupPassword"
            label="Password"
            minLength={8}
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Create a password"
            required
            value={password}
          />

          {/* Confirm password */}
          <PasswordInput
            autoComplete="new-password"
            // className="[@media(max-height:760px)]:h-10"
            error={passwordError}
            id="confirmPassword"
            label="Confirm Password"
            minLength={8}
            name="confirmPassword"
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm your password"
            required
            value={confirmPassword}
          />

          {/* Gender — reference mein left side */}
          <fieldset>
            {/* <legend className="mb-2 text-[13px] font-semibold text-slate-800 [@media(max-height:760px)]:mb-1.5 [@media(max-height:760px)]:text-xs"> */}
            <legend className="mb-2 text-[13px] font-semibold text-slate-800">
              Gender
            </legend>

            {/* <div className="flex min-h-12 flex-wrap items-center gap-x-4 gap-y-2 [@media(max-height:760px)]:min-h-10"> */}
            <div className="flex min-h-12 flex-wrap items-center gap-x-5 gap-y-2">
              {genders.map(({ label, value }) => (
                <label
                  // className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 [@media(max-height:760px)]:text-xs"
                  className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
                  key={value}
                >
                  <input
                    checked={gender === value}
                    className="sr-only"
                    name="gender"
                    onChange={() => setGender(value)}
                    type="radio"
                    value={value}
                  />

                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border transition",
                      gender === value
                        ? "border-violet-600 ring-4 ring-violet-100"
                        : "border-slate-300",
                    )}
                  >
                    {gender === value && (
                      <span className="size-2.5 rounded-full bg-violet-600" />
                    )}
                  </span>

                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {/* City — reference mein right side */}
          <AuthField htmlFor="city" label="City" required>
            <div className="relative">
              <MapPin
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />

              <input
                autoComplete="address-level2"
                className={cn(authInputClassName, compactInputClassName)}
                id="city"
                name="city"
                placeholder="Enter your city"
                required
                type="text"
              />
            </div>
          </AuthField>
        </div>

        {/* Profile photo */}
        <div>
          <label
            // className="mb-2 block text-[13px] font-semibold text-slate-800 [@media(max-height:760px)]:mb-1.5 [@media(max-height:760px)]:text-xs"
            className="mb-2 block text-[13px] font-semibold text-slate-800"
            htmlFor="profilePhoto"
          >
            Profile Photo (Required)
          </label>

          <label
            className="group flex min-h-20 cursor-pointer items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 transition hover:border-violet-400 hover:bg-violet-50/40 [@media(max-height:760px)]:min-h-16 [@media(max-height:760px)]:py-2"
            // className="size-12 rounded-xl object-cover shadow-sm ring-2 ring-white"
            htmlFor="profilePhoto"
          >
            {photoPreview ? (
              <img
                alt="Selected profile"
                // className="size-12 rounded-xl object-cover shadow-sm ring-2 ring-white [@media(max-height:760px)]:size-10"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-violet-600 shadow-sm ring-1 ring-slate-200"
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
              name="profilePhoto"
              onChange={handlePhotoChange}
              required
              type="file"
            />
          </label>
        </div>

        {/* Terms */}
        {/* <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600 [@media(max-height:760px)]:text-xs"> */}
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-slate-600">
          <input
            className="peer sr-only"
            name="acceptedTerms"
            required
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

        {/* Submit */}
        <button
          // className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 [@media(max-height:760px)]:h-10"
          className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
          type="submit"
        >
          Create Account
        </button>

        {/* Sign in */}
        {/* <p className="text-center text-sm text-slate-500 [@media(max-height:760px)]:text-xs"> */}
        <p className="text-center text-sm text-slate-500">
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
