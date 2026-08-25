import { Crown, Sparkles } from "lucide-react";

export const SidebarUpgradeCard = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/20 via-indigo-500/15 to-fuchsia-500/10 p-4">
      <div
        aria-hidden="true"
        className="absolute -right-8 -top-8 size-24 rounded-full bg-violet-400/20 blur-2xl"
      />

      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex size-9 items-center justify-center rounded-xl bg-violet-400/20 text-violet-200">
            <Crown aria-hidden="true" size={18} />
          </span>

          <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-200">
            Coming soon
          </span>
        </div>

        <h2 className="text-sm font-bold text-white">Upgrade to Pro</h2>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          Unlock more storage and advanced note tools.
        </p>

        <button
          className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-xs font-bold text-slate-300 opacity-80"
          disabled
          type="button"
        >
          <Sparkles aria-hidden="true" size={15} />
          Upgrade to Pro
        </button>
      </div>
    </section>
  );
};
