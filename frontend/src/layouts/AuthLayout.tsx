import { Cloud, Rocket, ShieldCheck } from "lucide-react";
import { Outlet } from "react-router";

import { Logo } from "@/components/shared/Logo";

const features = [
  {
    icon: ShieldCheck,
    title: "Your notes, always secure",
    description: "Private access for your ideas and notes.",
  },
  {
    icon: Cloud,
    title: "Access anywhere",
    description: "Use your workspace across your devices.",
  },
  {
    icon: Rocket,
    title: "Built for productivity",
    description: "Focus on the notes that matter most.",
  },
];

export const AuthLayout = () => {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-2xl shadow-indigo-950/10 lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-700 p-12 text-white lg:flex lg:flex-col">
          <div className="absolute -left-24 top-1/3 size-64 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="absolute -right-20 bottom-20 size-72 rounded-full bg-indigo-300/15 blur-3xl" />

          <Logo className="relative z-10" />

          <div className="relative z-10 mt-20">
            <h1 className="max-w-md text-5xl font-bold leading-tight tracking-tight">
              Organize your{" "}
              <span className="text-violet-300">ideas beautifully.</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-indigo-100">
              A secure and focused workspace for creating, managing, and
              reviewing your notes.
            </p>
          </div>

          <div className="relative z-10 mt-auto space-y-5 pt-16">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon size={21} />
                </span>

                <div>
                  <h2 className="font-semibold">{title}</h2>

                  <p className="mt-1 text-sm text-indigo-200">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex items-center justify-center bg-white p-6 sm:p-10 lg:p-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
