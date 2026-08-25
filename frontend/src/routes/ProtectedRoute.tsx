import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
}

export const ProtectedRoute = ({ isAuthenticated }: ProtectedRouteProps) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
