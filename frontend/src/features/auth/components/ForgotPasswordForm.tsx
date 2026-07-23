import { ArrowLeft, Info, Mail } from "lucide-react";
import type { FormEvent } from "react";

import {
  AuthField,
  authInputClassName,
} from "@/features/auth/components/AuthField";

interface ForgotPasswordFormProps {
  onBackToSignIn: () => void;
  onCodeSent: () => void;
}

export const ForgotPasswordForm = ({
  onBackToSignIn,
  onCodeSent,
}: ForgotPasswordFormProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /*
     * API integration mein onCodeSent()
     * successful response ke baad call hoga.
     */
    onCodeSent();
  };

  return (
    <div className="mx-auto w-full max-w-[415px]">
      <header>
        <h1 className="text-[1.8rem] font-bold tracking-tight text-[#17143d]">
          Forgot Password?
        </h1>

        <p className="mt-1.5 text-sm leading-6 text-slate-500">
          Enter your registered email address and we&apos;ll send you a
          verification code.
        </p>
      </header>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <AuthField htmlFor="forgotPasswordEmail" label="Email Address" required>
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />

            <input
              autoComplete="email"
              className={`${authInputClassName} h-11 pl-11`}
              id="forgotPasswordEmail"
              name="email"
              placeholder="Enter your email"
              required
              type="email"
            />
          </div>
        </AuthField>

        <div className="flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/70 p-4">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <Info aria-hidden="true" size={17} />
          </span>

          <p className="text-xs leading-5 text-slate-600">
            We&apos;ll send a 6-digit verification code to your registered email
            address.
          </p>
        </div>

        <button
          className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
          type="submit"
        >
          Send Reset Code
        </button>

        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-slate-200" />

          <span className="text-xs text-slate-400">or</span>

          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          className="mx-auto flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-violet-600 transition hover:text-violet-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100"
          onClick={onBackToSignIn}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={17} />
          Back to Sign In
        </button>
      </form>
    </div>
  );
};
