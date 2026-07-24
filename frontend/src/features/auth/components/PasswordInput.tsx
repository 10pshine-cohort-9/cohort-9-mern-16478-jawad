import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";

import {
  AuthField,
  authInputClassName,
} from "@/features/auth/components/AuthField";

interface PasswordInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  error?: string;
  label: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className = "", error, id, label, required, ...inputProps }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const errorId = error ? `${id}-error` : undefined;

    return (
      <AuthField
        error={error}
        htmlFor={String(id)}
        label={label}
        required={required}
      >
        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={17}
          />

          <input
            {...inputProps}
            aria-describedby={errorId}
            aria-invalid={Boolean(error)}
            className={`${authInputClassName} pl-11 pr-12 ${className}`}
            id={id}
            ref={ref}
            required={required}
            type={isPasswordVisible ? "text" : "password"}
          />

          <button
            aria-label={isPasswordVisible ? "Hide password" : "Show password"}
            className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-400 transition hover:text-violet-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100"
            onClick={() => {
              setIsPasswordVisible((current) => !current);
            }}
            type="button"
          >
            {isPasswordVisible ? (
              <EyeOff aria-hidden="true" size={18} />
            ) : (
              <Eye aria-hidden="true" size={18} />
            )}
          </button>
        </div>
      </AuthField>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
