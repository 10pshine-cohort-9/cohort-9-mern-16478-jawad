import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import {
  getCurrentUser,
  loginUser,
  logoutUser,
} from "@/features/auth/services/auth.api";
import type {
  AuthUserResponse,
  LoginRequest,
  PublicUser,
} from "@/features/auth/types/auth.types";

import { AuthContext, type AuthContextValue } from "./auth-context";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<PublicUser | null>(null);

  const [isInitializing, setIsInitializing] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await getCurrentUser();

      setUser(response.data.user);
    } catch {
      /*
       * /auth/me par 401 ka matlab
       * authenticated session available
       * nahi hai.
       */
      setUser(null);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (input: LoginRequest): Promise<AuthUserResponse> => {
      const response = await loginUser(input);

      setUser(response.data.user);

      return response;
    },
    [],
  );

  const logout = useCallback(async () => {
    await logoutUser();

    setUser(null);
  }, []);

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: user !== null,

      isInitializing,

      login,

      logout,

      refreshUser,

      user,
    }),
    [isInitializing, login, logout, refreshUser, user],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
