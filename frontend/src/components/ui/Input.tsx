import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400",
          "focus:border-violet-500 focus:ring-4 focus:ring-violet-100",
          hasError
            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
            : "border-slate-200",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
