import type { ReactNode } from "react";

interface AuthFieldProps {
  children: ReactNode;
  error?: string;
  htmlFor: string;
  label: string;
  required?: boolean;
}

export const authInputClassName =
  "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-100";

export const AuthField = ({
  children,
  error,
  htmlFor,
  label,
  required = false,
}: AuthFieldProps) => {
  return (
    <div>
      <label
        aria-label={required ? `${label} (required)` : label}
        className="mb-2 block text-[13px] font-semibold text-slate-800"
        htmlFor={htmlFor}
      >
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
