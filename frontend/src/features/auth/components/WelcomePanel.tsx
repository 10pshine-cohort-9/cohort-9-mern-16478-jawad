import {
  Cloud,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import { Logo } from "@/components/shared/Logo";

interface WelcomePanelProps {
  compact?: boolean;
  isSignUp: boolean;
}

const signUpFeatures = [
  {
    icon: ShieldCheck,
    title: "Your notes, always secure",
    description:
      "End-to-end protection for your ideas.",
  },
  {
    icon: Cloud,
    title: "Access anywhere",
    description:
      "Sync across all your devices.",
  },
  {
    icon: Rocket,
    title: "Built for productivity",
    description:
      "Focus on what matters most.",
  },
];

const signInFeatures = [
  {
    icon: ShieldCheck,
    title: "Your notes, always secure",
    description:
      "End-to-end encryption for your peace of mind.",
  },
  {
    icon: Cloud,
    title: "Access anywhere",
    description:
      "Sync across all your devices.",
  },
  {
    icon: Rocket,
    title: "Built for productivity",
    description:
      "Focus on what matters most.",
  },
];

export const WelcomePanel = ({
  compact = false,
  isSignUp,
}: WelcomePanelProps) => {
  const content = isSignUp
    ? {
        description:
          "Organize your notes, ideas, and tasks securely in one beautiful workspace.",
        features: signUpFeatures,
        highlightedText: "workspace",
        image:
          "/images/auth/signup-illustration.png",
        imageAlt:
          "Notebook and pen illustration",
        title: "Create your",
      }
    : {
        description:
          "Sign in to continue to your secure workspace.",
        features: signInFeatures,
        highlightedText: "",
        image:
          "/images/auth/signin-illustration.png",
        imageAlt:
          "Secure notes and password illustration",
        title: "",
      };

  if (compact) {
    return (
      <aside className="relative min-h-48 overflow-hidden bg-gradient-to-br from-[#11145f] via-[#1b2188] to-[#5730d6] text-white">
        <div className="relative z-10 grid min-h-48 grid-cols-[1fr_150px] items-center gap-4 px-5 py-4">
          <div className="min-w-0">
            <Logo />

            {content.title && (
              <h1 className="mt-4 text-2xl font-bold leading-tight">
                {content.title}

                <span className="ml-2 bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                  {
                    content.highlightedText
                  }
                </span>
              </h1>
            )}

            <p
              className={
                content.title
                  ? "mt-2 text-xs leading-5 text-indigo-100"
                  : "mt-5 max-w-[340px] text-sm leading-6 text-indigo-100"
              }
            >
              {content.description}
            </p>
          </div>

          <img
            alt={content.imageAlt}
            className="max-h-32 w-full object-contain"
            src={content.image}
          />
        </div>
      </aside>
    );
  }

  return (
    <aside className="relative h-full min-h-0 overflow-hidden bg-gradient-to-br from-[#10145d] via-[#191f82] to-[#5430d0] text-white">
      <div className="pointer-events-none absolute -left-28 top-1/3 size-72 rounded-full bg-indigo-400/15 blur-3xl" />

      <div className="pointer-events-none absolute -right-28 bottom-0 size-80 rounded-full bg-violet-300/15 blur-3xl" />

      <span className="pointer-events-none absolute left-[11%] top-[42%] text-base text-white">
        ✦
      </span>

      <span className="pointer-events-none absolute right-[11%] top-[18%] text-lg text-indigo-300">
        ✦
      </span>

      <span className="pointer-events-none absolute right-[17%] top-[31%] text-sm text-violet-200">
        ✦
      </span>

      <div className="relative z-10 grid h-full min-h-0 grid-rows-[auto_auto_minmax(160px,1fr)_auto] px-6 py-6 xl:px-7 xl:py-7">
        <Logo />

        <header
          className={
            isSignUp
              ? "mt-6"
              : "mt-4"
          }
        >
          {content.title && (
            <h1 className="max-w-[350px] text-[2.25rem] font-bold leading-[1.06] tracking-tight">
              {content.title}

              <span className="mt-1 block bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                {
                  content.highlightedText
                }
              </span>
            </h1>
          )}

          <p
            className={
              isSignUp
                ? "mt-3 max-w-[345px] text-sm leading-6 text-indigo-100"
                : "mt-2 max-w-[350px] text-sm leading-6 text-indigo-100"
            }
          >
            {content.description}
          </p>
        </header>

        <div className="flex min-h-0 items-center justify-center py-1">
          <img
            alt={content.imageAlt}
            className={
              isSignUp
                ? "h-auto max-h-[230px] w-full max-w-[350px] object-contain"
                : "h-auto max-h-[220px] w-full max-w-[385px] object-contain"
            }
            src={content.image}
          />
        </div>

        <div className="space-y-2">
          {content.features.map(
            ({
              icon: Icon,
              title,
              description,
            }) => (
              <article
                className="flex items-center gap-3 border-b border-white/10 pb-2 last:border-0 last:pb-0"
                key={title}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
                  <Icon
                    aria-hidden="true"
                    size={17}
                    strokeWidth={2}
                  />
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
            ),
          )}
        </div>
      </div>
    </aside>
  );
};