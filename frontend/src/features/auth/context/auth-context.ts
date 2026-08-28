import { createContext } from "react";

import type {
  AuthUserResponse,
  LoginRequest,
  PublicUser,
} from "@/features/auth/types/auth.types";

export interface AuthContextValue {
  isAuthenticated: boolean;
  isInitializing: boolean;

  login: (input: LoginRequest) => Promise<AuthUserResponse>;

  logout: () => Promise<void>;

  refreshUser: () => Promise<void>;

  user: PublicUser | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
