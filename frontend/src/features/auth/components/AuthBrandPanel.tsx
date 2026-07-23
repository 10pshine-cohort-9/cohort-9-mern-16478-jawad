import { Cloud, Rocket, ShieldCheck } from "lucide-react";

// import { Logo } from "@/components/shared/Logo";
import { Logo } from "../../../components/shared/Logo";

interface AuthBrandPanelProps {
  heading: string;
  highlightedText: string;
  description: string;
  illustrationSrc: string;
  illustrationAlt: string;
}

const features = [
  {
    icon: ShieldCheck,
    title: "Your notes, always secure",
    description: "Private and protected access to your ideas.",
  },
  {
    icon: Cloud,
    title: "Access anywhere",
    description: "Use your notes across all your devices.",
  },
  {
    icon: Rocket,
    title: "Built for productivity",
    description: "Stay focused on what matters most.",
  },
];

export const AuthBrandPanel = ({
  heading,
  highlightedText,
  description,
  illustrationSrc,
  illustrationAlt,
}: AuthBrandPanelProps) => {
  return (
    <aside className="relative hidden min-h-full overflow-hidden bg-gradient-to-br from-[#11145f] via-[#1b2088] to-[#5e32de] px-10 py-9 text-white lg:flex lg:flex-col xl:px-14 xl:py-11">
      <div className="pointer-events-none absolute -left-28 top-1/3 size-72 rounded-full bg-indigo-400/15 blur-3xl" />

      <div className="pointer-events-none absolute -right-28 bottom-10 size-80 rounded-full bg-violet-300/15 blur-3xl" />

      <div className="relative z-10">
        <Logo />

        <div className="mt-12 xl:mt-14">
          <h1 className="max-w-md text-4xl font-bold leading-[1.08] tracking-tight xl:text-5xl">
            {heading}
            <span className="mt-1 block bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              {highlightedText}
            </span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-6 text-indigo-100 xl:text-base xl:leading-7">
            {description}
          </p>
        </div>

        <div className="relative mx-auto mt-5 flex max-w-[430px] justify-center xl:mt-7">
          <span className="absolute left-5 top-8 size-1.5 rounded-full bg-amber-300" />
          <span className="absolute right-8 top-4 size-2 rounded-full bg-indigo-300 shadow-[0_0_20px_rgba(165,180,252,0.9)]" />
          <span className="absolute right-2 top-20 size-1.5 rotate-45 bg-violet-200" />

          <img
            src={illustrationSrc}
            alt={illustrationAlt}
            className="h-auto w-full max-w-[390px] object-contain"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 62%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse at center, black 62%, transparent 100%)",
            }}
          />
        </div>
      </div>

      <div className="relative z-10 mt-auto space-y-4 pt-4">
        {features.map(
          ({ icon: Icon, title, description: featureDescription }) => (
            <article
              key={title}
              className="flex items-start gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
                <Icon aria-hidden="true" size={20} strokeWidth={2} />
              </span>

              <div>
                <h2 className="text-sm font-semibold text-white xl:text-base">
                  {title}
                </h2>

                <p className="mt-1 text-xs leading-5 text-indigo-200 xl:text-sm">
                  {featureDescription}
                </p>
              </div>
            </article>
          ),
        )}
      </div>
    </aside>
  );
};
