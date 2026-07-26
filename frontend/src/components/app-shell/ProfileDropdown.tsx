import {
  ChevronDown,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/cn";

const getInitials = (fullName: string): string => {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const ProfileDropdown = () => {
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const menuRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [imageFailed, setImageFailed] = useState(false);

  const [logoutError, setLogoutError] = useState<string>();

  useEffect(() => {
    setImageFailed(false);
  }, [user?.profileImageUrl]);

  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);

      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(undefined);

    try {
      await logout();

      setIsOpen(false);

      navigate("/login", {
        replace: true,
      });
    } catch {
      setLogoutError("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const profileImage =
    !imageFailed && user.profileImageUrl ? (
      <img
        alt={`${user.fullName} profile`}
        className="size-10 rounded-full object-cover ring-2 ring-violet-100 dark:ring-violet-500/30"
        onError={() => {
          setImageFailed(true);
        }}
        src={user.profileImageUrl}
      />
    ) : (
      <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-black text-white ring-2 ring-violet-100 dark:ring-violet-500/30">
        {getInitials(user.fullName)}
      </span>
    );

  return (
    <div className="relative" ref={menuRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-xl px-1.5 py-1.5 text-left transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100 dark:hover:bg-white/5 dark:focus-visible:ring-violet-500/20"
        onClick={() => {
          setIsOpen((currentValue) => !currentValue);
        }}
        type="button"
      >
        {profileImage}

        <span className="hidden min-w-0 sm:block">
          <span className="block max-w-36 truncate text-sm font-bold text-slate-900 dark:text-white">
            {user.fullName}
          </span>

          <span className="block max-w-36 truncate text-xs text-slate-500 dark:text-slate-400">
            @{user.username}
          </span>
        </span>

        <ChevronDown
          aria-hidden="true"
          className={cn(
            "hidden text-slate-400 transition-transform sm:block",
            isOpen && "rotate-180",
          )}
          size={17}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-[calc(100%+12px)] z-50 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[#1d1d31]"
          role="menu"
        >
          <div className="border-b border-slate-100 px-3 py-3 dark:border-white/5">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {user.fullName}
            </p>

            <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
              @{user.username}
            </p>
          </div>

          <div className="py-2">
            <Link
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              onClick={() => {
                setIsOpen(false);
              }}
              role="menuitem"
              to="/profile"
            >
              <UserRound size={18} />
              My Profile
            </Link>

            <Link
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              onClick={() => {
                setIsOpen(false);
              }}
              role="menuitem"
              to="/privacy"
            >
              <ShieldCheck size={18} />
              Privacy
            </Link>

            <Link
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
              onClick={() => {
                setIsOpen(false);
              }}
              role="menuitem"
              to="/settings"
            >
              <Settings size={18} />
              Settings
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-2 dark:border-white/5">
            <button
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-red-500/10"
              disabled={isLoggingOut}
              onClick={() => {
                void handleLogout();
              }}
              role="menuitem"
              type="button"
            >
              <LogOut size={18} />

              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>

            {logoutError && (
              <p
                className="px-3 py-2 text-xs font-semibold text-red-600"
                role="alert"
              >
                {logoutError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
