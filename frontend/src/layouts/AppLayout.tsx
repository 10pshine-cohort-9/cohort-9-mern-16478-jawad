import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router";

import { Logo } from "@/components/shared/Logo";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/cn";

const getInitials = (fullName: string) => {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const AppLayout = () => {
  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [logoutError, setLogoutError] = useState<string>();

  const [imageFailed, setImageFailed] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setImageFailed(false);
  }, [user?.profileImageUrl]);

  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
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

      setIsMenuOpen(false);

      navigate("/login", {
        replace: true,
      });
    } catch {
      setLogoutError("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          <div className="relative" ref={menuRef}>
            <button
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-1.5 text-left transition hover:border-slate-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100"
              onClick={() => {
                setIsMenuOpen((current) => !current);
              }}
              type="button"
            >
              {!imageFailed && user.profileImageUrl ? (
                <img
                  alt={`${user.fullName} profile`}
                  className="size-10 rounded-full object-cover ring-2 ring-violet-100"
                  onError={() => {
                    setImageFailed(true);
                  }}
                  src={user.profileImageUrl}
                />
              ) : (
                <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white ring-2 ring-violet-100">
                  {getInitials(user.fullName)}
                </span>
              )}

              <span className="hidden min-w-0 sm:block">
                <span className="block max-w-40 truncate text-sm font-semibold text-slate-900">
                  {user.fullName}
                </span>

                <span className="block max-w-40 truncate text-xs text-slate-500">
                  @{user.username}
                </span>
              </span>

              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "text-slate-400 transition-transform",
                  isMenuOpen && "rotate-180",
                )}
                size={18}
              />
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)]"
                role="menu"
              >
                <div className="border-b border-slate-100 px-3 py-3">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.fullName}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                </div>

                <button
                  className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isLoggingOut}
                  onClick={() => {
                    void handleLogout();
                  }}
                  role="menuitem"
                  type="button"
                >
                  <LogOut aria-hidden="true" size={18} />

                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>

                {logoutError && (
                  <p
                    className="px-3 pb-2 pt-1 text-xs font-medium text-red-600"
                    role="alert"
                  >
                    {logoutError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
