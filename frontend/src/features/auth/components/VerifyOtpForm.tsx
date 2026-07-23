import { ArrowLeft, Clock3 } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";

interface VerifyOtpFormProps {
  onBackToSignIn: () => void;
  onVerified: () => void;
}

const OTP_LENGTH = 6;
const INITIAL_SECONDS = 165;

const createEmptyCode = (): string[] => {
  return Array.from(
    {
      length: OTP_LENGTH,
    },
    () => "",
  );
};

export const VerifyOtpForm = ({
  onBackToSignIn,
  onVerified,
}: VerifyOtpFormProps) => {
  const [code, setCode] = useState<string[]>(createEmptyCode);

  const [remainingSeconds, setRemainingSeconds] = useState(INITIAL_SECONDS);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      return;
    }

    const timerId = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(current - 1, 0));
    }, 1_000);

    return () => {
      window.clearInterval(timerId);
    };
  }, [remainingSeconds]);

  const otpValue = code.join("");

  const minutes = Math.floor(remainingSeconds / 60);

  const seconds = remainingSeconds % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds,
  ).padStart(2, "0")}`;

  const updateDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setCode((currentCode) => {
      const nextCode = [...currentCode];

      nextCode[index] = digit;

      return nextCode;
    });

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

      setCode((currentCode) => {
        const nextCode = [...currentCode];

        nextCode[index - 1] = "";

        return nextCode;
      });

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

    setCode(nextCode);

    const focusIndex = Math.min(pastedDigits.length, OTP_LENGTH - 1);

    inputRefs.current[focusIndex]?.focus();
  };

  const handleResendCode = () => {
    setCode(createEmptyCode());
    setRemainingSeconds(INITIAL_SECONDS);

    inputRefs.current[0]?.focus();

    // Resend OTP API integration later phase mein hogi.
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otpValue.length !== OTP_LENGTH) {
      inputRefs.current[code.findIndex((digit) => !digit)]?.focus();

      return;
    }

    /*
     * Verify OTP API successful hone ke baad
     * onVerified() call hoga.
     */
    onVerified();
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

        <p className="text-sm font-semibold text-violet-600">
          alexjohnson@email.com
        </p>
      </header>

      <form className="mt-7 space-y-6" onSubmit={handleSubmit}>
        <fieldset>
          <legend className="sr-only">
            Enter the six-digit verification code
          </legend>

          <div className="grid grid-cols-6 gap-2.5 sm:gap-3">
            {code.map((digit, index) => (
              <input
                aria-label={`Verification code digit ${index + 1}`}
                autoComplete={index === 0 ? "one-time-code" : "off"}
                autoFocus={index === 0}
                className="h-14 min-w-0 rounded-xl border border-slate-200 bg-white text-center text-xl font-semibold text-[#17143d] outline-none transition hover:border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 sm:h-16 sm:text-2xl"
                id={`otp-digit-${index}`}
                inputMode="numeric"
                key={index}
                maxLength={1}
                name={`otpDigit${index + 1}`}
                onChange={(event) => updateDigit(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPaste={handlePaste}
                pattern="[0-9]*"
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                value={digit}
              />
            ))}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-500">
            <Clock3 aria-hidden="true" size={18} />

            <span>
              Code expires in{" "}
              <strong className="font-semibold text-violet-600">
                {formattedTime}
              </strong>
            </span>
          </div>

          <button
            className="font-semibold text-violet-600 transition hover:text-violet-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100"
            onClick={handleResendCode}
            type="button"
          >
            Resend code
          </button>
        </div>

        <button
          className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 text-base font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={otpValue.length !== OTP_LENGTH}
          type="submit"
        >
          Verify
        </button>

        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-slate-200" />

          <span className="whitespace-nowrap text-sm text-slate-500">
            or go back
          </span>

          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          className="mx-auto flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-violet-600 transition hover:text-violet-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100"
          onClick={onBackToSignIn}
          type="button"
        >
          <ArrowLeft aria-hidden="true" size={18} />
          Back to Sign In
        </button>
      </form>
    </div>
  );
};
