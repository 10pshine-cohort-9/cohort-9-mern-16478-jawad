import { AuthPlaceholderPage } from "@/features/auth/components/AuthPlaceholderPage";

const SignupPage = () => {
  return (
    <AuthPlaceholderPage
      title="Create your account"
      description="Create a secure workspace and start organizing your notes."
      linkLabel="Already registered? Sign in"
      linkTo="/login"
    />
  );
};

export default SignupPage;
