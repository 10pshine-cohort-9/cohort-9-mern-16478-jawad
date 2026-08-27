import { X } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/lib/cn";

import { AppSidebar } from "./AppSidebar";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;

      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div
      aria-hidden={!isOpen}
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <button
        aria-label="Close navigation"
        className={cn(
          "absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
        type="button"
      />

      <div
        className={cn(
          "relative h-full w-72 max-w-[85vw] transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          aria-label="Close navigation"
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
          onClick={onClose}
          type="button"
        >
          <X size={19} />
        </button>

        <AppSidebar onNavigate={onClose} />
      </div>
    </div>
  );
};
