import { AuthPlaceholderPage } from "@/features/auth/components/AuthPlaceholderPage";

const VerifyOtpPage = () => {
  return (
    <AuthPlaceholderPage
      title="Verify code"
      description="Enter the six-digit verification code sent to your email address."
      linkLabel="Back to forgot password"
      linkTo="/forgot-password"
    />
  );
};

export default VerifyOtpPage;
