import { createBrowserRouter, Navigate } from "react-router";
import { NotFoundPage } from "@/components/shared/NotFoundPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import VerifyOtpPage from "@/features/auth/pages/VerifyOtpPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import { AppLayout } from "@/layouts/AppLayout";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PublicOnlyRoute } from "@/features/auth/components/PublicOnlyRoute";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate replace to="/login" />,
  },

  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/verify-otp",
        element: <VerifyOtpPage />,
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },

          /*
           * Notes routes bhi isi
           * AppLayout children mein
           * protected rahengi.
           */
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
