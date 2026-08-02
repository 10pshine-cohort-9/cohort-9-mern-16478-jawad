import { AppError } from "../../common/errors/app-error.js";
import { env } from "../../config/env.js";
import { mailer } from "../../lib/mailer.js";

interface EmailRecipient {
  email: string;
  fullName: string;
}

interface PasswordResetOtpEmailInput extends EmailRecipient {
  otp: string;
  expiresInMinutes: number;
}

const escapeHtml = (value: string): string => {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character] ?? character;
  });
};

interface EmailTemplateOptions {
  heading: string;
  greeting: string;
  paragraphs: string[];
  code?: string;
  action?: {
    label: string;
    url: string;
  };
  notice?: string;
}

const renderEmailTemplate = ({
  heading,
  greeting,
  paragraphs,
  code,
  action,
  notice,
}: EmailTemplateOptions): string => {
  const paragraphHtml = paragraphs
    .map(
      (paragraph) => `
        <p style="margin:0 0 16px; color:#4b5563; font-size:16px; line-height:26px;">
          ${escapeHtml(paragraph)}
        </p>
      `,
    )
    .join("");

  const codeHtml = code
    ? `
      <div style="margin:26px 0; padding:20px; background:#f3f4f6; border:1px solid #e5e7eb; border-radius:8px; text-align:center;">
        <p style="margin:0 0 8px; color:#6b7280; font-size:13px; text-transform:uppercase; letter-spacing:1px;">
          Verification code
        </p>

        <p style="margin:0; color:#111827; font-size:32px; line-height:40px; font-weight:700; letter-spacing:8px;">
          ${escapeHtml(code)}
        </p>
      </div>
    `
    : "";

  const actionHtml = action
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:26px 0;">
        <tr>
          <td>
            <a
              href="${escapeHtml(action.url)}"
              style="display:inline-block; background:#111827; color:#ffffff; text-decoration:none; padding:13px 26px; border-radius:6px; font-size:15px; font-weight:600;"
            >
              ${escapeHtml(action.label)}
            </a>
          </td>
        </tr>
      </table>
    `
    : "";

  const noticeHtml = notice
    ? `
      <div style="margin-top:26px; padding:14px 16px; background:#fff7ed; border-left:4px solid #f97316; border-radius:4px;">
        <p style="margin:0; color:#9a3412; font-size:13px; line-height:21px;">
          ${escapeHtml(notice)}
        </p>
      </div>
    `
    : "";

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>${escapeHtml(heading)}</title>
      </head>

      <body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          style="padding:32px 12px; background:#f4f6f8;"
        >
          <tr>
            <td align="center">
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                style="max-width:600px; background:#ffffff; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden;"
              >
                <tr>
                  <td style="padding:24px 32px; background:#111827; text-align:center;">
                    <h1 style="margin:0; color:#ffffff; font-size:24px;">
                      Notes App
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:36px 32px;">
                    <h2 style="margin:0 0 20px; color:#111827; font-size:22px;">
                      ${escapeHtml(heading)}
                    </h2>

                    <p style="margin:0 0 18px; color:#111827; font-size:16px; line-height:26px;">
                      ${escapeHtml(greeting)}
                    </p>

                    ${paragraphHtml}
                    ${codeHtml}
                    ${actionHtml}
                    ${noticeHtml}

                    <p style="margin:28px 0 0; color:#4b5563; font-size:15px; line-height:24px;">
                      Regards,<br />
                      <strong>Notes App Team</strong>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 32px; background:#f9fafb; border-top:1px solid #e5e7eb; text-align:center;">
                    <p style="margin:0; color:#9ca3af; font-size:12px; line-height:18px;">
                      This is an automated security email from Notes App.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export const sendWelcomeEmail = async ({
  email,
  fullName,
}: EmailRecipient): Promise<void> => {
  if (!mailer || !env.MAIL_FROM_EMAIL) {
    return;
  }

  try {
    const loginUrl = new URL("/login", env.CLIENT_URL).toString();

    await mailer.sendMail({
      from: {
        name: env.MAIL_FROM_NAME,
        address: env.MAIL_FROM_EMAIL,
      },

      to: email,

      subject: "Welcome to Notes App - Your account is ready",

      text: [
        `Hello ${fullName},`,
        "",
        "Your Notes App account has been created successfully.",
        "You can now log in and start managing your personal notes.",
        "",
        `Login: ${loginUrl}`,
        "",
        "Regards,",
        "Notes App Team",
      ].join("\n"),

      html: renderEmailTemplate({
        heading: "Welcome to Notes App",
        greeting: `Hello ${fullName},`,

        paragraphs: [
          "Your Notes App account has been created successfully.",
          "You can now create, organize and securely manage your personal notes.",
        ],

        action: {
          label: "Log in to Notes App",
          url: loginUrl,
        },
      }),
    });
  } catch (error) {
    throw new AppError("Welcome email could not be sent", 502, {
      code: "WELCOME_EMAIL_SEND_FAILED",
      cause: error,
    });
  }
};

export const sendPasswordResetOtpEmail = async ({
  email,
  fullName,
  otp,
  expiresInMinutes,
}: PasswordResetOtpEmailInput): Promise<void> => {
  if (!mailer || !env.MAIL_FROM_EMAIL) {
    return;
  }

  try {
    await mailer.sendMail({
      from: {
        name: env.MAIL_FROM_NAME,
        address: env.MAIL_FROM_EMAIL,
      },

      to: email,

      subject: "Your Notes App password reset code",

      text: [
        `Hello ${fullName},`,
        "",
        "We received a request to reset your Notes App password.",
        `Your verification code is: ${otp}`,
        `This code expires in ${expiresInMinutes} minutes.`,
        "",
        "Do not share this code with anyone.",
        "If you did not request a password reset, you can ignore this email.",
        "",
        "Regards,",
        "Notes App Team",
      ].join("\n"),

      html: renderEmailTemplate({
        heading: "Reset your password",
        greeting: `Hello ${fullName},`,

        paragraphs: [
          "We received a request to reset the password for your Notes App account.",
          `Enter the following code to continue. This code expires in ${expiresInMinutes} minutes.`,
        ],

        code: otp,

        notice:
          "Do not share this verification code with anyone. If you did not request a password reset, you can safely ignore this email.",
      }),
    });
  } catch (error) {
    throw new AppError("Password reset OTP email could not be sent", 502, {
      code: "PASSWORD_RESET_OTP_EMAIL_SEND_FAILED",
      cause: error,
    });
  }
};

export const sendPasswordResetSuccessEmail = async ({
  email,
  fullName,
}: EmailRecipient): Promise<void> => {
  if (!mailer || !env.MAIL_FROM_EMAIL) {
    return;
  }

  try {
    const loginUrl = new URL("/login", env.CLIENT_URL).toString();

    await mailer.sendMail({
      from: {
        name: env.MAIL_FROM_NAME,
        address: env.MAIL_FROM_EMAIL,
      },

      to: email,

      subject: "Your Notes App password was changed",

      text: [
        `Hello ${fullName},`,
        "",
        "Your Notes App password has been reset successfully.",
        "You can now log in using your new password.",
        "",
        `Login: ${loginUrl}`,
        "",
        "If you did not make this change, secure your email account immediately.",
        "",
        "Regards,",
        "Notes App Team",
      ].join("\n"),

      html: renderEmailTemplate({
        heading: "Password reset successful",

        greeting: `Hello ${fullName},`,

        paragraphs: [
          "Your Notes App password has been reset successfully.",
          "You can now log in to your account using your new password.",
        ],

        action: {
          label: "Log in with new password",
          url: loginUrl,
        },

        notice:
          "If you did not make this change, secure your email account immediately.",
      }),
    });
  } catch (error) {
    throw new AppError(
      "Password reset confirmation email could not be sent",
      502,
      {
        code: "PASSWORD_RESET_SUCCESS_EMAIL_SEND_FAILED",
        cause: error,
      },
    );
  }
};
