import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";

import {
  AuthField,
  authInputClassName,
} from "@/features/auth/components/AuthField";
import { cn } from "@/lib/cn";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: string;
  label: string;
}

export const PasswordInput = ({
  className,
  error,
  id,
  label,
  required,
  ...props
}: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!id) {
    throw new Error("PasswordInput requires an id");
  }

  return (
    <AuthField
      error={error}
      htmlFor={id}
      label={label}
      required={required}
    >
      <div className="relative">
        <LockKeyhole
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />

        <input
          {...props}
          className={cn(
            authInputClassName,
            "pl-11 pr-12",
            error &&
              "border-red-400 focus:border-red-500 focus:ring-red-100",
            className,
          )}
          id={id}
          required={required}
          type={isVisible ? "text" : "password"}
        />

        <button
          aria-label={
            isVisible
              ? `Hide ${label.toLowerCase()}`
              : `Show ${label.toLowerCase()}`
          }
          className="absolute right-2.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-violet-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100"
          onClick={() => setIsVisible((current) => !current)}
          type="button"
        >
          {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </AuthField>
  );
};
