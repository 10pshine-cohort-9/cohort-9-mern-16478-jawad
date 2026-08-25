import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Circle } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { PasswordInput } from "@/features/auth/components/PasswordInput";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { resetUserPassword } from "@/features/auth/services/auth.api";
import { getApiErrorMessage } from "@/features/auth/utils/get-api-error-message";
import { cn } from "@/lib/cn";

interface ResetPasswordFormProps {
  onBackToSignIn: () => void;
  onPasswordReset: () => void;
}

export const ResetPasswordForm = ({
  onBackToSignIn,
  onPasswordReset,
}: ResetPasswordFormProps) => {
  const [successMessage, setSuccessMessage] = useState<string>();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),

    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const confirmPassword = watch("confirmPassword");

  const requirements = useMemo(
    () => [
      {
        label: "At least 8 characters",
        passed: password.length >= 8,
      },
      {
        label: "Includes uppercase and lowercase letters",
        passed: /[A-Z]/.test(password) && /[a-z]/.test(password),
      },
      {
        label: "Includes a number",
        passed: /\d/.test(password),
      },
      {
        label: "Includes a special character",
        passed: /[^A-Za-z0-9]/.test(password),
      },
    ],
    [password],
  );

  const completedRequirements = requirements.filter(
    ({ passed }) => passed,
  ).length;

  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const isFormReady =
    completedRequirements === requirements.length && passwordsMatch;

  const strengthLabel = (() => {
    if (completedRequirements <= 1) {
      return "Weak";
    }

    if (completedRequirements === 2) {
      return "Fair";
    }

    if (completedRequirements === 3) {
      return "Good";
    }

    return "Strong";
  })();

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setSuccessMessage(undefined);

    try {
      const response = await resetUserPassword({
        password: values.password,

        confirmPassword: values.confirmPassword,
      });

      setSuccessMessage(response.message);

      window.setTimeout(() => {
        onPasswordReset();
      }, 900);
    } catch (error) {
      setError("root.server", {
        type: "server",
        message: getApiErrorMessage(error),
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <header>
        <h1 className="text-[1.8rem] font-bold tracking-tight text-[#17143d] sm:text-[2rem]">
          Reset Password
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter and confirm your new password.
        </p>
      </header>

      <form
        className="mt-6 space-y-5"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <PasswordInput
          {...register("password")}
          autoComplete="new-password"
          className="h-12"
          error={errors.password?.message}
          id="newPassword"
          label="New Password"
          placeholder="Enter your new password"
          required
        />

        <PasswordInput
          {...register("confirmPassword")}
          autoComplete="new-password"
          className="h-12"
          error={errors.confirmPassword?.message}
          id="confirmNewPassword"
          label="Confirm Password"
          placeholder="Confirm your new password"
          required
        />

        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="text-sm font-semibold text-[#17143d]">
            Password strength:{" "}
            <span
              className={
                completedRequirements === 4
                  ? "text-emerald-600"
                  : "text-violet-600"
              }
            >
              {strengthLabel}
            </span>
          </p>

          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {requirements.map(({ label, passed }) => (
              <span
                className={cn(
                  "h-1.5 rounded-full transition",
                  passed
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600"
                    : "bg-slate-200",
                )}
                key={label}
              />
            ))}
          </div>

          <div className="mt-4 space-y-2.5">
            {requirements.map(({ label, passed }) => (
              <div className="flex items-center gap-3 text-sm" key={label}>
                {passed ? (
                  <CheckCircle2 className="text-violet-600" size={18} />
                ) : (
                  <Circle className="text-slate-300" size={18} />
                )}

                <span className="text-slate-600">{label}</span>
              </div>
            ))}
          </div>
        </section>

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

        <button
          className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 text-base font-semibold text-white shadow-lg shadow-violet-600/20 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!isFormReady || isSubmitting || Boolean(successMessage)}
          type="submit"
        >
          {isSubmitting ? "Resetting Password..." : "Reset Password"}
        </button>

        <p className="text-center text-sm text-slate-500">
          Remember your password?{" "}
          <button
            className="font-semibold text-violet-600 hover:text-violet-800"
            onClick={onBackToSignIn}
            type="button"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
};
