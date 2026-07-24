import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "@/features/auth/hooks/useAuth";

export const ProtectedRoute = () => {
  const location = useLocation();

  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-slate-50">
        <div className="text-center">
          <span className="mx-auto block size-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Restoring your session...
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        state={{
          from: location.pathname,
        }}
        to="/login"
      />
    );
  }

  return <Outlet />;
};
