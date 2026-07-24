import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { AuthForm } from "@/features/auth/components/AuthForm";
import { ForgotPasswordBrandPanel } from "@/features/auth/components/ForgotPasswordBrandPanel";
import { WelcomePanel } from "@/features/auth/components/WelcomePanel";
import "@/features/auth/styles/auth.css";
import {
  authPathByMode,
  isRecoveryMode,
  type AuthMode,
} from "@/features/auth/types/auth-mode";

interface AuthPageProps {
  initialMode?: AuthMode;
}

const RESET_EMAIL_STORAGE_KEY = "notes-app-password-reset-email";

export const AuthPage = ({ initialMode = "signIn" }: AuthPageProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const [recoveryEmail, setRecoveryEmail] = useState(() => {
    return window.sessionStorage.getItem(RESET_EMAIL_STORAGE_KEY) ?? "";
  });

  const shouldReduceMotion = useReducedMotion();

  const formIsOnRight = mode !== "signIn";

  const isSignup = mode === "signUp";

  const panelTransition = shouldReduceMotion
    ? {
        duration: 0,
      }
    : {
        type: "spring" as const,
        stiffness: 115,
        damping: 24,
        mass: 0.9,
      };

  const saveRecoveryEmail = (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    setRecoveryEmail(normalizedEmail);

    window.sessionStorage.setItem(RESET_EMAIL_STORAGE_KEY, normalizedEmail);
  };

  const clearRecoveryEmail = () => {
    setRecoveryEmail("");

    window.sessionStorage.removeItem(RESET_EMAIL_STORAGE_KEY);
  };

  const handleModeChange = (nextMode: AuthMode) => {
    if (nextMode === "signIn" || nextMode === "signUp") {
      clearRecoveryEmail();
    }

    setMode(nextMode);

    window.history.replaceState({}, "", authPathByMode[nextMode]);
  };

  const visualPanel = isRecoveryMode(mode) ? (
    <ForgotPasswordBrandPanel mode={mode} />
  ) : (
    <WelcomePanel isSignUp={mode === "signUp"} />
  );

  return (
    <MotionConfig reducedMotion="user">
      <main className="min-h-[100dvh] overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_28%),#f7f7ff] p-2 lg:flex lg:h-[100dvh] lg:min-h-0 lg:items-center lg:justify-center lg:overflow-hidden">
        <section
          className={`mx-auto w-full max-w-[1050px] overflow-hidden rounded-[1.6rem] border border-white/80 bg-white shadow-[0_22px_65px_rgba(49,46,129,0.15)] lg:h-[calc(100dvh-16px)] ${
            isSignup ? "lg:max-h-[820px]" : "lg:max-h-[680px]"
          }`}
        >
          {/* Desktop */}
          <div className="relative hidden h-full min-h-0 overflow-hidden lg:block">
            <motion.div
              animate={{
                left: formIsOnRight ? "37%" : "0%",
              }}
              className="absolute inset-y-0 z-20 h-full w-[63%] overflow-hidden bg-white"
              initial={false}
              transition={panelTransition}
            >
              <AuthForm
                mode={mode}
                onModeChange={handleModeChange}
                onRecoveryEmailChange={saveRecoveryEmail}
                recoveryEmail={recoveryEmail}
              />
            </motion.div>

            <motion.div
              animate={{
                left: formIsOnRight ? "0%" : "63%",
              }}
              className="absolute inset-y-0 z-10 h-full w-[37%] overflow-hidden"
              initial={false}
              transition={panelTransition}
            >
              {visualPanel}
            </motion.div>
          </div>

          {/* Mobile */}
          <div className="lg:hidden">
            <div className="min-h-48">{visualPanel}</div>

            <AuthForm
              mode={mode}
              onModeChange={handleModeChange}
              onRecoveryEmailChange={saveRecoveryEmail}
              recoveryEmail={recoveryEmail}
            />
          </div>
        </section>
      </main>
    </MotionConfig>
  );
};
