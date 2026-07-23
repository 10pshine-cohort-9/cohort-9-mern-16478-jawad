import { Navigate, Outlet } from "react-router";

interface PublicOnlyRouteProps {
  isAuthenticated: boolean;
}

export const PublicOnlyRoute = ({ isAuthenticated }: PublicOnlyRouteProps) => {
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};
