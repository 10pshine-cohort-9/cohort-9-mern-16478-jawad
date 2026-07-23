import { AuthPlaceholderPage } from "@/features/auth/components/AuthPlaceholderPage";

const ResetPasswordPage = () => {
  return (
    <AuthPlaceholderPage
      title="Reset password"
      description="Create and confirm a strong new password for your account."
      linkLabel="Back to sign in"
      linkTo="/login"
    />
  );
};

export default ResetPasswordPage;
