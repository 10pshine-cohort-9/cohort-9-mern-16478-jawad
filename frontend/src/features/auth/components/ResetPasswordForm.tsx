import { CheckCircle2, Circle } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { cn } from "@/lib/cn";

interface ResetPasswordFormProps {
  onBackToSignIn: () => void;
  onPasswordReset: () => void;
}

interface PasswordRequirement {
  label: string;
  passed: boolean;
}

export const ResetPasswordForm = ({
  onBackToSignIn,
  onPasswordReset,
}: ResetPasswordFormProps) => {
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitError, setSubmitError] = useState<string>();

  const requirements = useMemo<PasswordRequirement[]>(
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

  const isFormValid =
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

  const strengthTextClassName =
    completedRequirements === 4
      ? "text-emerald-600"
      : completedRequirements === 3
        ? "text-violet-600"
        : completedRequirements === 2
          ? "text-amber-600"
          : "text-red-500";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (completedRequirements !== requirements.length) {
      setSubmitError("Please meet all password requirements.");

      return;
    }

    if (!passwordsMatch) {
      setSubmitError("Passwords do not match.");

      return;
    }

    setSubmitError(undefined);

    /*
     * Auth integration phase mein:
     * await resetPasswordApi(...)
     *
     * Successful response ke baad hi
     * onPasswordReset() call hoga.
     */
    onPasswordReset();
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

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <PasswordInput
          autoComplete="new-password"
          className="h-12"
          id="newPassword"
          label="New Password"
          minLength={8}
          name="password"
          onChange={(event) => {
            setPassword(event.target.value);

            if (submitError) {
              setSubmitError(undefined);
            }
          }}
          placeholder="Enter your new password"
          required
          value={password}
        />

        <PasswordInput
          autoComplete="new-password"
          className="h-12"
          error={
            confirmPassword && !passwordsMatch
              ? "Passwords do not match."
              : undefined
          }
          id="confirmNewPassword"
          label="Confirm Password"
          minLength={8}
          name="confirmPassword"
          onChange={(event) => {
            setConfirmPassword(event.target.value);

            if (submitError) {
              setSubmitError(undefined);
            }
          }}
          placeholder="Confirm your new password"
          required
          value={confirmPassword}
        />

        {/* Password strength card */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="text-sm font-semibold text-[#17143d]">
            Password strength:{" "}
            <span className={strengthTextClassName}>{strengthLabel}</span>
          </p>

          {/* Strength bars */}
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {requirements.map(({ passed, label }) => (
              <span
                aria-label={label}
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

          {/* Requirements */}
          <div className="mt-4 space-y-2.5">
            {requirements.map(({ label, passed }) => (
              <div className="flex items-center gap-3 text-sm" key={label}>
                {passed ? (
                  <CheckCircle2
                    aria-hidden="true"
                    className="shrink-0 text-violet-600"
                    size={18}
                  />
                ) : (
                  <Circle
                    aria-hidden="true"
                    className="shrink-0 text-slate-300"
                    size={18}
                  />
                )}

                <span
                  className={cn(passed ? "text-slate-700" : "text-slate-500")}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {submitError && (
          <p className="text-sm font-medium text-red-600" role="alert">
            {submitError}
          </p>
        )}

        <button
          className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 text-base font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!isFormValid}
          type="submit"
        >
          Reset Password
        </button>

        <p className="text-center text-sm text-slate-500">
          Remember your password?{" "}
          <button
            className="font-semibold text-violet-600 transition hover:text-violet-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100"
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
