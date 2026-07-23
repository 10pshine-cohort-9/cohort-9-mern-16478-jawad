import { AuthPlaceholderPage } from "@/features/auth/components/AuthPlaceholderPage";

const ForgotPasswordPage = () => {
  return (
    <AuthPlaceholderPage
      title="Forgot password?"
      description="Enter your email address to receive a password-reset verification code."
      linkLabel="Back to sign in"
      linkTo="/login"
    />
  );
};

export default ForgotPasswordPage;