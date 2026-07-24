import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import {
  AuthField,
  authInputClassName,
} from "@/features/auth/components/AuthField";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { SocialLoginButtons } from "@/features/auth/components/SocialLoginButtons";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/auth.schemas";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getApiErrorMessage } from "@/features/auth/utils/get-api-error-message";

interface SignInFormProps {
  onShowForgotPassword: () => void;
  onShowSignUp: () => void;
}

export const SignInForm = ({
  onShowForgotPassword,
  onShowSignUp,
}: SignInFormProps) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login({
        identifier: values.identifier.trim().toLowerCase(),

        password: values.password,
      });

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      setError("root.server", {
        type: "server",
        message: getApiErrorMessage(error),
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[415px]">
      <header>
        <h1 className="text-[1.8rem] font-bold tracking-tight text-[#17143d]">
          Sign in
        </h1>

        <p className="mt-1.5 text-sm leading-6 text-slate-500">
          Enter your credentials to access your account.
        </p>
      </header>

      <form
        className="mt-5 space-y-4"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <AuthField
          error={errors.identifier?.message}
          htmlFor="loginIdentifier"
          label="Email or Username"
          required
        >
          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />

            <input
              {...register("identifier")}
              aria-invalid={Boolean(errors.identifier)}
              autoComplete="username"
              className={`${authInputClassName} h-11 pl-11`}
              id="loginIdentifier"
              placeholder="Enter email or username"
              type="text"
            />
          </div>
        </AuthField>

        <PasswordInput
          {...register("password")}
          autoComplete="current-password"
          className="h-11"
          error={errors.password?.message}
          id="loginPassword"
          label="Password"
          placeholder="Enter your password"
          required
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <label className="flex cursor-pointer items-center gap-2.5 font-medium text-violet-600">
            <input className="peer sr-only" name="rememberMe" type="checkbox" />
            <span className="flex size-[18px] shrink-0 items-center justify-center rounded border border-slate-300 bg-white text-white transition peer-checked:border-violet-600 peer-checked:bg-violet-600 peer-focus-visible:ring-4 peer-focus-visible:ring-violet-100">
              <svg
                aria-hidden="true"
                className="size-3"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path
                  d="m3.5 8.2 2.8 2.8 6.2-6.2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
            Remember me
          </label>

          <button
            className="font-semibold text-violet-600 transition hover:text-violet-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100"
            onClick={onShowForgotPassword}
            type="button"
          >
            Forgot Password?
          </button>
        </div>

        {errors.root?.server?.message && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
            role="alert"
          >
            {errors.root.server.message}
          </div>
        )}

        <button
          className="flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>

        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-slate-200" />

          <span className="whitespace-nowrap text-xs text-slate-500">
            or continue with
          </span>

          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <SocialLoginButtons />

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <button
            className="font-semibold text-violet-600 transition hover:text-violet-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100"
            onClick={onShowSignUp}
            type="button"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};
