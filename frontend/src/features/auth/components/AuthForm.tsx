import { AnimatePresence, motion } from "motion/react";

import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { SignInForm } from "@/features/auth/components/SignInForm";
import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { VerifyOtpForm } from "@/features/auth/components/VerifyOtpForm";
import type { AuthMode } from "@/features/auth/types/auth-mode";

interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onRecoveryEmailChange: (email: string) => void;
  recoveryEmail: string;
}

export const AuthForm = ({
  mode,
  onModeChange,
  onRecoveryEmailChange,
  recoveryEmail,
}: AuthFormProps) => {
  const isSignup = mode === "signUp";

  const renderForm = () => {
    switch (mode) {
      case "signIn":
        return (
          <SignInForm
            onShowForgotPassword={() => onModeChange("forgotPassword")}
            onShowSignUp={() => onModeChange("signUp")}
          />
        );

      case "signUp":
        return <SignUpForm onShowSignIn={() => onModeChange("signIn")} />;

      case "forgotPassword":
        return (
          <ForgotPasswordForm
            onBackToSignIn={() => onModeChange("signIn")}
            onCodeSent={(email) => {
              onRecoveryEmailChange(email);

              onModeChange("verifyOtp");
            }}
          />
        );

      case "verifyOtp":
        return (
          <VerifyOtpForm
            email={recoveryEmail}
            onBackToSignIn={() => onModeChange("signIn")}
            onVerified={() => onModeChange("resetPassword")}
          />
        );

      case "resetPassword":
        return (
          <ResetPasswordForm
            onBackToSignIn={() => onModeChange("signIn")}
            onPasswordReset={() => onModeChange("signIn")}
          />
        );
    }
  };

  return (
    <section className="h-full min-h-0 bg-white">
      <div
        className={
          isSignup
            ? "auth-scrollbar h-full overflow-y-auto overscroll-contain px-5 py-7 sm:px-8 lg:px-10 lg:py-8 xl:px-12"
            : "h-full overflow-hidden px-5 py-7 sm:px-8 lg:px-10 xl:px-12"
        }
      >
        <div
          className={
            isSignup
              ? "flex min-h-full items-start justify-center"
              : "flex h-full items-center justify-center"
          }
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="w-full"
              exit={{
                opacity: 0,
                x: mode === "signIn" ? -20 : 20,
              }}
              initial={{
                opacity: 0,
                x: mode === "signIn" ? -20 : 20,
              }}
              key={mode}
              transition={{
                duration: 0.22,
                ease: "easeOut",
              }}
            >
              {renderForm()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
