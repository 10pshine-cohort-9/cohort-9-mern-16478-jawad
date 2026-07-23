import { AuthPlaceholderPage } from "@/features/auth/components/AuthPlaceholderPage";

const LoginPage = () => {
  return (
    <AuthPlaceholderPage
      title="Sign in"
      description="Enter your credentials to access your secure Notes App workspace."
      linkLabel="Create a new account"
      linkTo="/signup"
    />
  );
};

export default LoginPage;
