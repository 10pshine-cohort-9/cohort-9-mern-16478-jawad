import { AnimatePresence, motion } from "motion/react";
import { Cloud, MailCheck, Rocket, ShieldCheck, Zap } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import type { RecoveryMode } from "@/features/auth/types/auth-mode";

interface ForgotPasswordBrandPanelProps {
  mode: RecoveryMode;
}

interface RecoveryContent {
  description: string;
  features: Array<{
    description: string;
    icon: typeof ShieldCheck;
    title: string;
  }>;
  highlightedText: string;
  image: string;
  imageAlt: string;
  title: string;
}

const standardFeatures = [
  {
    icon: ShieldCheck,
    title: "Your notes, always secure",
    description: "End-to-end encryption for your peace of mind.",
  },
  {
    icon: Cloud,
    title: "Access anywhere",
    description: "Sync across all your devices.",
  },
  {
    icon: Rocket,
    title: "Built for productivity",
    description: "Focus on what matters most.",
  },
];

const recoveryFeatures = [
  {
    icon: ShieldCheck,
    title: "Secure password reset",
    description: "Your recovery process stays private and protected.",
  },
  {
    icon: MailCheck,
    title: "Email verification",
    description: "We verify ownership through your registered email.",
  },
  {
    icon: Zap,
    title: "Quick account recovery",
    description: "Return to your notes in a few simple steps.",
  },
];

const contentByMode: Record<RecoveryMode, RecoveryContent> = {
  forgotPassword: {
    title: "Forgot your",
    highlightedText: "password?",
    description:
      "No worries — we will help you securely recover access to your Notes App account.",
    image: "/images/auth/forgot-password-illustration.png",
    imageAlt: "Envelope, key and password recovery illustration",
    features: recoveryFeatures,
  },

  verifyOtp: {
    title: "Secure",
    highlightedText: "verification",
    description:
      "We've sent a 6-digit verification code to your email address.",
    image: "/images/auth/verify-otp-illustration.png",
    imageAlt: "Secure email and verification code illustration",
    features: standardFeatures,
  },

  resetPassword: {
    title: "Reset your",
    highlightedText: "password",
    description: "Choose a strong new password to secure your account.",
    image: "/images/auth/reset-password-illustration.png",
    imageAlt: "Padlock, security shield and key illustration",
    features: standardFeatures,
  },
};

export const ForgotPasswordBrandPanel = ({
  mode,
}: ForgotPasswordBrandPanelProps) => {
  const content = contentByMode[mode];

  return (
    <aside className="relative h-full min-h-0 overflow-hidden bg-gradient-to-br from-[#10145d] via-[#191f82] to-[#5430d0] text-white">
      <div className="pointer-events-none absolute -left-28 top-1/3 size-72 rounded-full bg-indigo-400/15 blur-3xl" />

      <div className="pointer-events-none absolute -right-28 bottom-0 size-80 rounded-full bg-violet-300/15 blur-3xl" />

      <span className="pointer-events-none absolute left-[12%] top-[44%] text-base text-white">
        ✦
      </span>

      <span className="pointer-events-none absolute right-[12%] top-[18%] text-lg text-indigo-300">
        ✦
      </span>

      <span className="pointer-events-none absolute right-[18%] top-[31%] text-sm text-violet-200">
        ✦
      </span>

      <div className="relative z-10 flex h-full min-h-0 flex-col px-6 py-6 xl:px-7 xl:py-7">
        <Logo />

        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="mt-6 flex min-h-0 flex-1 flex-col"
            exit={{
              opacity: 0,
              x: -18,
            }}
            initial={{
              opacity: 0,
              x: 18,
            }}
            key={mode}
            transition={{
              duration: 0.24,
              ease: "easeOut",
            }}
          >
            <header className="shrink-0">
              <h1 className="max-w-[350px] text-[2.25rem] font-bold leading-[1.06] tracking-tight">
                {content.title}

                <span className="mt-1 block bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                  {content.highlightedText}
                </span>
              </h1>

              <p className="mt-3 max-w-[345px] text-sm leading-6 text-indigo-100">
                {content.description}
              </p>
            </header>

            <div className="flex min-h-0 flex-1 items-center justify-center py-2">
              <img
                alt={content.imageAlt}
                className={
                  mode === "verifyOtp"
                    ? "h-auto max-h-[230px] w-full max-w-[365px] object-contain"
                    : mode === "resetPassword"
                      ? "h-auto max-h-[225px] w-full max-w-[365px] object-contain"
                      : "h-auto max-h-[215px] w-full max-w-[350px] object-contain"
                }
                src={content.image}
              />
            </div>

            <div className="shrink-0 space-y-2">
              {content.features.map(({ icon: Icon, title, description }) => (
                <article
                  className="flex items-center gap-3 border-b border-white/10 pb-2 last:border-0 last:pb-0"
                  key={title}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
                    <Icon aria-hidden="true" size={17} strokeWidth={2} />
                  </span>

                  <div className="min-w-0">
                    <h2 className="text-[13px] font-semibold leading-5 text-white">
                      {title}
                    </h2>

                    <p className="text-[11px] leading-4 text-indigo-200">
                      {description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </aside>
  );
};
