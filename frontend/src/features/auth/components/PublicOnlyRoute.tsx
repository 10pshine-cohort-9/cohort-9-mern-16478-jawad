import { Navigate, Outlet } from "react-router";

import { useAuth } from "@/features/auth/hooks/useAuth";

export const PublicOnlyRoute = () => {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-slate-50">
        <span className="block size-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />;
  }

  return <Outlet />;
};
