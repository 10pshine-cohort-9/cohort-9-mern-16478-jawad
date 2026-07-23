import { NotebookPen } from "lucide-react";

import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export const Logo = ({ className, compact = false }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-violet-950/20">
        <NotebookPen size={23} strokeWidth={2.2} />
      </span>

      {!compact && (
        <span className="text-xl font-bold tracking-tight">Notes App</span>
      )}
    </div>
  );
};
