import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Clock3 } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useForm } from "react-hook-form";

import {
  verifyResetOtpSchema,
  type VerifyResetOtpFormValues,
} from "@/features/auth/schemas/auth.schemas";
import {
  requestPasswordReset,
  verifyResetOtp as verifyResetOtpRequest,
} from "@/features/auth/services/auth.api";
import { getApiErrorMessage } from "@/features/auth/utils/get-api-error-message";

interface VerifyOtpFormProps {
  email: string;
  onBackToSignIn: () => void;
  onVerified: () => void;
}

const OTP_LENGTH = 6;
const INITIAL_SECONDS = 165;

const createEmptyCode = () =>
  Array.from(
    {
      length: OTP_LENGTH,
    },
    () => "",
  );

export const VerifyOtpForm = ({
  email,
  onBackToSignIn,
  onVerified,
}: VerifyOtpFormProps) => {
  const [code, setCode] = useState<string[]>(createEmptyCode);

  const [remainingSeconds, setRemainingSeconds] = useState(INITIAL_SECONDS);

  const [isResending, setIsResending] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string>();

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VerifyResetOtpFormValues>({
    resolver: zodResolver(verifyResetOtpSchema),

    defaultValues: {
      email,
      otp: "",
    },
  });

  useEffect(() => {
    setValue("email", email, {
      shouldValidate: true,
    });
  }, [email, setValue]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0));
    }, 1_000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [remainingSeconds]);

  const otpValue = code.join("");

  const minutes = Math.floor(remainingSeconds / 60);

  const seconds = remainingSeconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  const commitCode = (nextCode: string[]) => {
    setCode(nextCode);

    setValue("otp", nextCode.join(""), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const nextCode = [...code];

    nextCode[index] = digit;

    commitCode(nextCode);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      event.preventDefault();

      const nextCode = [...code];

      nextCode[index - 1] = "";

      commitCode(nextCode);

      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedDigits) {
      return;
    }

    const nextCode = createEmptyCode();

    pastedDigits.split("").forEach((digit, index) => {
      nextCode[index] = digit;
    });

    commitCode(nextCode);

    inputRefs.current[Math.min(pastedDigits.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("root.server", {
        type: "server",
        message:
          "Recovery email is missing. Start the password reset process again.",
      });

      return;
    }

    setIsResending(true);
    setSuccessMessage(undefined);

    try {
      const response = await requestPasswordReset({
        email,
      });

      commitCode(createEmptyCode());

      setRemainingSeconds(INITIAL_SECONDS);

      setSuccessMessage(response.message);

      inputRefs.current[0]?.focus();
    } catch (error) {
      setError("root.server", {
        type: "server",
        message: getApiErrorMessage(error),
      });
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (values: VerifyResetOtpFormValues) => {
    setSuccessMessage(undefined);

    try {
      const response = await verifyResetOtpRequest({
        email: values.email.trim().toLowerCase(),

        otp: values.otp,
      });

      setSuccessMessage(response.message);

      window.setTimeout(() => {
        onVerified();
      }, 700);
    } catch (error) {
      setError("root.server", {
        type: "server",
        message: getApiErrorMessage(error),
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-[520px]">
      <header>
        <h1 className="text-[1.8rem] font-bold tracking-tight text-[#17143d] sm:text-[2rem]">
          Enter Verification Code
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          We sent a 6-digit code to
        </p>

        <p className="break-all text-sm font-semibold text-violet-600">
          {email || "your registered email"}
        </p>
      </header>

      <form
        className="mt-7 space-y-6"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <input {...register("email")} type="hidden" />

        <input {...register("otp")} type="hidden" />

        <div className="grid grid-cols-6 gap-2.5 sm:gap-3">
          {code.map((digit, index) => (
            <input
              aria-label={`Verification code digit ${index + 1}`}
              aria-invalid={Boolean(errors.otp)}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              autoFocus={index === 0}
              className="h-14 min-w-0 rounded-xl border border-slate-200 bg-white text-center text-xl font-semibold text-[#17143d] outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 sm:h-16 sm:text-2xl"
              inputMode="numeric"
              key={index}
              maxLength={1}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onPaste={handlePaste}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              value={digit}
            />
          ))}
        </div>

        {errors.otp?.message && (
          <p className="text-sm font-medium text-red-600" role="alert">
            {errors.otp.message}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-2 text-slate-500">
            <Clock3 size={18} />
            Code expires in{" "}
            <strong className="text-violet-600">{formattedTime}</strong>
          </span>

          <button
            className="font-semibold text-violet-600 hover:text-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isResending || !email}
            onClick={handleResendCode}
            type="button"
          >
            {isResending ? "Sending..." : "Resend code"}
          </button>
        </div>

        {errors.root?.server?.message && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
            role="alert"
          >
            {errors.root.server.message}
          </div>
        )}

        {successMessage && (
          <div
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
            role="status"
          >
            {successMessage}
          </div>
        )}

        <button
          className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 text-base font-semibold text-white shadow-lg shadow-violet-600/20 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={
            isSubmitting ||
            otpValue.length !== OTP_LENGTH ||
            !email ||
            Boolean(successMessage)
          }
          type="submit"
        >
          {isSubmitting ? "Verifying..." : "Verify"}
        </button>

        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-slate-200" />

          <span className="text-sm text-slate-500">or go back</span>

          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          className="mx-auto flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-800"
          onClick={onBackToSignIn}
          type="button"
        >
          <ArrowLeft size={18} />
          Back to Sign In
        </button>
      </form>
    </div>
  );
};
