export const SocialLoginButtons = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button
        className="flex h-12   items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-[#17143d] transition hover:border-violet-200 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100"
        type="button"
      >
        <GoogleIcon />
        Google
      </button>

      <button
        className="flex h-12 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-[#17143d] transition hover:border-violet-200 hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100"
        type="button"
      >
        <GitHubIcon />
        GitHub
      </button>
    </div>
  );
};

const GoogleIcon = () => {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24">
      <path
        d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.6Z"
        fill="#4285F4"
      />

      <path
        d="M12 22c2.7 0 5-.9 6.8-2.3l-3.3-2.6c-.9.6-2.1 1-3.5 1a6 6 0 0 1-5.6-4.1H3v2.7A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />

      <path
        d="M6.4 14a6 6 0 0 1 0-3.9V7.4H3A10 10 0 0 0 3 16.7L6.4 14Z"
        fill="#FBBC05"
      />

      <path
        d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 12 2a10 10 0 0 0-9 5.4L6.4 10A6 6 0 0 1 12 5.9Z"
        fill="#EA4335"
      />
    </svg>
  );
};

const GitHubIcon = () => {
  return (
    <svg
      aria-hidden="true"
      className="size-5 text-black"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05A9.37 9.37 0 0 1 12 6.92c.85 0 1.7.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
};
