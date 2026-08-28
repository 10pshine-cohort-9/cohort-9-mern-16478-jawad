export type AuthMode =
  | "signIn"
  | "signUp"
  | "forgotPassword"
  | "verifyOtp"
  | "resetPassword";

export type RecoveryMode = "forgotPassword" | "verifyOtp" | "resetPassword";

export const authPathByMode: Record<AuthMode, string> = {
  signIn: "/login",
  signUp: "/signup",
  forgotPassword: "/forgot-password",
  verifyOtp: "/verify-otp",
  resetPassword: "/reset-password",
};

export const isRecoveryMode = (mode: AuthMode): mode is RecoveryMode => {
  return (
    mode === "forgotPassword" ||
    mode === "verifyOtp" ||
    mode === "resetPassword"
  );
};
